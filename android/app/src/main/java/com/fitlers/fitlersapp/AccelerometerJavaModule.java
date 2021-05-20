package com.fitlers.fitlersapp;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.IllegalViewOperationException;

import javax.annotation.Nullable;

public class AccelerometerJavaModule extends ReactContextBaseJavaModule implements SensorEventListener, LifecycleEventListener {

    public static int STOPPED = 0;
    public static int STARTING = 1;
    public static int RUNNING = 2;
    public static int ERROR_FAILED_TO_START = 3;

    private int status;     // status of listener

    ReactApplicationContext reactApplicationContext;
    SensorManager sensorManager;
    private Sensor mSensor;

    public AccelerometerJavaModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);//required by React Native
        this.reactApplicationContext = reactApplicationContext;
        this.reactApplicationContext.addLifecycleEventListener(this);

        this.status = this.STOPPED;
        sensorManager = (SensorManager) this.reactApplicationContext.getSystemService(Context.SENSOR_SERVICE);
    }

    @Override
    //getName is required to define the name of the module represented in JavaScript
    public String getName() {
        return "AccelerometerJavaModule";
    }


    @ReactMethod
    public void watchAccelerometerUpdates() {
        try {
            this.start();
        } catch (IllegalViewOperationException e) {

        }
    }

    @ReactMethod
    public void stopAccelerometerUpdates() {
        if (this.status == this.RUNNING) {
            this.stop();
        }
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        // Only look at accelerometer events
        if (event.sensor.getType() != this.mSensor.getType()) {
            return;
        }

        // If not running, then just return
        if (this.status == this.STOPPED) {
            return;
        }
        this.status = this.RUNNING;

        if (this.mSensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            sendAccelerometerUpdateEvent(getStepsParamsMap(event.values[0], event.values[1], event.values[2]));
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }


    /**
     * Start listening for Accelerometer sensor.
     */
    private void start() {
        // If already starting or running, then return
        if ((this.status == this.RUNNING) || (this.status == this.STARTING)) {
            return;
        }

        this.status = this.STARTING;
        this.mSensor = this.sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

        // If found, then register as listener
        if (this.mSensor != null) {
            int sensorDelay = SensorManager.SENSOR_DELAY_NORMAL;
            if (this.sensorManager.registerListener(this, this.mSensor, sensorDelay)) {
                this.status = this.STARTING;
            } else {
                this.status = this.ERROR_FAILED_TO_START;
                return;
            }
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
        this.status = this.STOPPED;
    }

    private WritableMap getStepsParamsMap(float x, float y, float z) {
        WritableMap map = Arguments.createMap();
        try {
            map.putDouble("x", x);
            map.putDouble("y", y);
            map.putDouble("z", z);
        } catch (Exception e) {

        }
        return map;
    }

    private void sendAccelerometerUpdateEvent(@Nullable WritableMap params) {
        this.reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("accelerometerDataDidUpdate", params);
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