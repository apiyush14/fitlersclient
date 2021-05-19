package com.fitlers.fitlersapp;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import java.util.HashMap;

public class PedometerService extends Service implements SensorEventListener, StepsListener {

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

    SensorManager sensorManager;
    private Sensor mSensor;
    private StepsDetector stepsDetector;

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        super.onStartCommand(intent, flags, startId);

        this.startAt = 0;
        this.numSteps = 0;
        this.startNumSteps = 0;
        this.status = this.STOPPED;
        this.stepsDetector = new StepsDetector();
        this.stepsDetector.registerListener(this);
        sensorManager = (SensorManager) this.getSystemService(Context.SENSOR_SERVICE);
        this.start();
        return START_STICKY;
    }

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

    private HashMap<String, String> getStepsParamsMap() {
        HashMap<String, String> map = new HashMap<String, String>();
        // pedometerData.startDate; -> ms since 1970
        // pedometerData.endDate; -> ms since 1970
        // pedometerData.numberOfSteps;
        // pedometerData.distance;
        // pedometerData.floorsAscended;
        // pedometerData.floorsDescended;
        try {
            map.put("startDate", String.valueOf(this.startAt));
            map.put("endDate", String.valueOf(System.currentTimeMillis()));
            map.put("steps", String.valueOf(this.numSteps));
            map.put("distance", String.valueOf(this.numSteps * this.STEP_IN_METERS));
        } catch (Exception e) {

        }
        return map;
    }

    private void sendPedometerUpdateEvent(@javax.annotation.Nullable HashMap<String, String> params) {
        LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(this);
        Intent pedometerEvent = new Intent("pedometer_event");
        pedometerEvent.putExtra("steps_data", params);
        localBroadcastManager.sendBroadcast(pedometerEvent);
    }

    @Override
    public void onDestroy() {
        this.stop();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
