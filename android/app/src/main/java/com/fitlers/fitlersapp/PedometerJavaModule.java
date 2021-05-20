package com.fitlers.fitlersapp;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.IllegalViewOperationException;

import javax.annotation.Nullable;

public class PedometerJavaModule extends ReactContextBaseJavaModule implements SensorEventListener, LifecycleEventListener, StepsListener {

    public static int STOPPED = 0;
    public static int STARTING = 1;
    public static int RUNNING = 2;
    public static int ERROR_FAILED_TO_START = 3;
    public static int ERROR_NO_SENSOR_FOUND = 4;
    public static float STEP_IN_METERS = 0.762f;

    private int status;     // status of listener
    private float numSteps; // number of the steps
    private float startNumSteps; //first value, to be subtracted in step counter sensor type
    private long startAt; //time stamp of when the measurement starts

    ReactApplicationContext reactApplicationContext;
    SensorManager sensorManager;
    private Sensor mSensor;
    private StepsDetector stepsDetector;

    public PedometerJavaModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);//required by React Native
        this.reactApplicationContext = reactApplicationContext;
        this.reactApplicationContext.addLifecycleEventListener(this);

        this.startAt = 0;
        this.numSteps = 0;
        this.startNumSteps = 0;
        this.status = this.STOPPED;
        this.stepsDetector = new StepsDetector();
        this.stepsDetector.registerListener(this);
        sensorManager = (SensorManager) this.reactApplicationContext.getSystemService(Context.SENSOR_SERVICE);
    }

    @Override
    //getName is required to define the name of the module represented in JavaScript
    public String getName() {
        return "PedometerJavaModule";
    }

    @ReactMethod
    public void isStepCountingAvailable(Callback callback) {
        Sensor stepCounter = this.sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
        Sensor accelerometer = this.sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        if (accelerometer != null || stepCounter != null) {
            callback.invoke(true);
        } else {
            callback.invoke(false);
        }
    }

    @ReactMethod
    public void watchStepCount() {
        try {
            this.start();
        } catch (IllegalViewOperationException e) {

        }
    }

    @ReactMethod
    public void stopPedometerUpdates() {
        if (this.status == this.RUNNING) {
            this.stop();
        }
    }

/*    @ReactMethod
    public void createFile(String fileName, String data){
        try {
            File file = new File(this.reactApplicationContext.getFilesDir(), "accelerometer_data");
            if (!file.exists()) {
                file.mkdir();
            }
            File file1 = new File(file, fileName);
            FileWriter writer = new FileWriter(file1);
            writer.append(data);
            writer.flush();
            writer.close();
        }
        catch(Exception e){

        }
    }*/

    @Override
    public void onSensorChanged(SensorEvent event) {
        // Only look at step counter or accelerometer events
        if (event.sensor.getType() != this.mSensor.getType()) {
            return;
        }

        // If not running, then just return
        if (this.status == this.STOPPED) {
            return;
        }
        this.status = this.RUNNING;

        if (this.mSensor.getType() == Sensor.TYPE_STEP_COUNTER) {
            float steps = event.values[0];
            if (this.startNumSteps == 0) {
                this.startNumSteps = steps;
            }
            this.numSteps = steps - this.startNumSteps;
            this.sendPedometerUpdateEvent(this.getStepsParamsMap());
        } else if (this.mSensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            stepsDetector.updateAcceleration(event.timestamp, event.values[0], event.values[1], event.values[2]);
        }
    }

    @Override
    public void step(long timeNs) {
        this.numSteps++;
        this.sendPedometerUpdateEvent(this.getStepsParamsMap());
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }


    /**
     * Start listening for pedometers sensor.
     */
    private void start() {
        // If already starting or running, then return
        if ((this.status == this.RUNNING) || (this.status == this.STARTING)) {
            return;
        }

        this.startAt = System.currentTimeMillis();
        this.numSteps = 0;
        this.startNumSteps = 0;
        this.status = this.STARTING;

        // Get pedometer or accelerometer from sensor manager
        this.mSensor = this.sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
        if (this.mSensor == null) {
            this.mSensor = this.sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        }

        // If found, then register as listener
        if (this.mSensor != null) {
            int sensorDelay = this.mSensor.getType() == Sensor.TYPE_STEP_COUNTER ? SensorManager.SENSOR_DELAY_UI : SensorManager.SENSOR_DELAY_FASTEST;
            if (this.sensorManager.registerListener(this, this.mSensor, sensorDelay)) {
                this.status = this.STARTING;
            } else {
                this.status = this.ERROR_FAILED_TO_START;
                return;
            }
            ;
        } else {
            this.status = ERROR_FAILED_TO_START;
            return;
        }
    }

    /**
     * Stop listening to sensor.
     */
    private void stop() {
        if (this.status != this.STOPPED) {
            this.sensorManager.unregisterListener(this);
        }
        this.startAt = 0;
        this.numSteps = 0;
        this.startNumSteps = 0;
        this.status = this.STOPPED;
    }

    private WritableMap getStepsParamsMap() {
        WritableMap map = Arguments.createMap();
        // pedometerData.startDate; -> ms since 1970
        // pedometerData.endDate; -> ms since 1970
        // pedometerData.numberOfSteps;
        // pedometerData.distance;
        // pedometerData.floorsAscended;
        // pedometerData.floorsDescended;
        try {
            map.putInt("startDate", (int) this.startAt);
            map.putInt("endDate", (int) System.currentTimeMillis());
            map.putDouble("steps", this.numSteps);
            map.putDouble("distance", this.numSteps * this.STEP_IN_METERS);
        } catch (Exception e) {

        }
        return map;
    }

    private void sendPedometerUpdateEvent(@Nullable WritableMap params) {
        this.reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("pedometerDataDidUpdate", params);
    }

    @Override
    public void onHostResume() {
    }

    @Override
    public void onHostPause() {
    }

    @Override
    public void onHostDestroy() {
        this.stop();
    }
}