package com.fitlers.fitlersapp;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

public class DistanceCalculationService extends Service implements SensorEventListener {

    public static int STOPPED = 0;
    public static int STARTING = 1;
    public static int RUNNING = 2;
    public static int ERROR_FAILED_TO_START = 3;

    private int userHeight;

    private int status;     // status of listener

    private long startAt; //time stamp of when the measurement starts
    private double startStepsCount; //first value, to be subtracted in step counter sensor type
    private double prevStepsCount; //previous value, to be subtracted in step counter sensor type
    private double stepsCount; // number of the steps
    private double totalDistance;

    SensorManager sensorManager;
    private Sensor pedometerSensor;
    private Sensor accelerometerSensor;

    private Timer timer;
    private List<Double> accelerationValues;

    private int[] rangeOfAcceleration = {10, 15, 20, 25, 30, 35, 40, 45, 50};
    private double[] rangeOfMultiplyingFactor = {0.40, 0.55, 0.70, 0.85, 1.00, 1.15, 1.30, 1.45, 1.60};
    private double defaultStrideMultiplyingFactor = 0.30;//Default Multiplier based on 12.5 average pace
    private double defaultAverageAcceleration = 9.8;//Default Acceleration Value based on 12.5 average pace

    @Override
    public void onCreate() {
        super.onCreate();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startServiceAsForegroundService();
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        super.onStartCommand(intent, flags, startId);

        this.startAt = System.currentTimeMillis();
        this.startStepsCount = 0;
        this.prevStepsCount = 0;
        this.stepsCount = 0;
        this.totalDistance = 0.0;

        accelerationValues = new ArrayList<Double>();
        this.userHeight = DistanceCalculatorModule.userHeight;

        this.status = this.STOPPED;
        sensorManager = (SensorManager) this.getSystemService(Context.SENSOR_SERVICE);
        this.start();

        timer = new Timer();
        TimerTask timerTask = new TimerTask() {
            @Override
            public void run() {
                sendDistanceUpdateEvent(getDistanceParamsMap());
            }
        };
        timer.scheduleAtFixedRate(timerTask, new Date(), 1000);
        return START_STICKY;
    }

    /**
     * Start listening for pedometer and accelerometer sensor.
     */
    private void start() {
        // If already starting or running, then return
        if ((this.status == this.RUNNING) || (this.status == this.STARTING)) {
            return;
        }

        this.startAt = System.currentTimeMillis();
        this.startStepsCount = 0;
        this.prevStepsCount = 0;
        this.stepsCount = 0;
        this.totalDistance = 0;
        this.status = this.STARTING;

        this.pedometerSensor = this.sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
        this.accelerometerSensor = this.sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

        // If found, then register as listener
        if (this.pedometerSensor != null && this.accelerometerSensor != null) {
            int sensorDelay = SensorManager.SENSOR_DELAY_UI;
            if (this.sensorManager.registerListener(this, this.pedometerSensor, sensorDelay)
                    && this.sensorManager.registerListener(this, this.accelerometerSensor, sensorDelay)) {
                this.status = this.RUNNING;
            } else {
                this.status = this.ERROR_FAILED_TO_START;
                return;
            }
        } else {
            this.status = ERROR_FAILED_TO_START;
            return;
        }
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        // If not running, then just return
        if (this.status == this.STOPPED) {
            return;
        }
        // Only look at pedometer or accelerometer events
        if (event.sensor.getType() == this.pedometerSensor.getType()) {
            float steps = event.values[0];
            if (this.startStepsCount == 0) {
                this.startStepsCount = steps;
            }
            updateDistanceBasedOnChangeInStepsCount(steps - this.prevStepsCount - this.startStepsCount);
            this.prevStepsCount = steps - this.startStepsCount;
            this.stepsCount=this.prevStepsCount;
        } else if (event.sensor.getType() == this.accelerometerSensor.getType()) {
            double accelerationMagnitude = Math.sqrt(event.values[0] * event.values[0] + event.values[1] * event.values[1] + event.values[2] * event.values[2]);
            accelerationValues.add(accelerationMagnitude);
        }
    }

    private void updateDistanceBasedOnChangeInStepsCount(double changeInStepsCount) {
        if (changeInStepsCount > 0.0) {
            double averageAcceleration = defaultAverageAcceleration;

            if (!accelerationValues.isEmpty()) {
                double sum = 0.0;
                for (int i = 0; i < accelerationValues.size(); i++) {
                    sum = sum + accelerationValues.get(i);
                }
                averageAcceleration = sum / accelerationValues.size();
            }
            accelerationValues.clear();

            double minStrideMultiplier = 0.40;
            double maxStrideMultiplier = 1.60;
            double minPace = 12.5;
            double maxPace = 2;

            for (int i = 0; i < rangeOfAcceleration.length - 1; i++) {
                if (averageAcceleration >= rangeOfAcceleration[i] &&
                        averageAcceleration <= rangeOfAcceleration[i + 1]) {
                    minStrideMultiplier = rangeOfMultiplyingFactor[i];
                    maxStrideMultiplier = rangeOfMultiplyingFactor[i + 1];
                    minPace = rangeOfAcceleration[i + 1];
                    maxPace = rangeOfAcceleration[i];
                    break;
                }
            }

            double strideMultiplyingFactor = maxStrideMultiplier - (((averageAcceleration - (minPace)) / (maxPace - minPace)) *
                    (maxStrideMultiplier - minStrideMultiplier));
            double strideValue = this.userHeight * strideMultiplyingFactor;
            double changeInDistanceInMeters = (changeInStepsCount * strideValue) / 100;
            totalDistance = totalDistance + changeInDistanceInMeters;
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }

    /**
     * Stop listening to sensor.
     */
    private void stop() {
        if (this.status != this.STOPPED) {
            this.sensorManager.unregisterListener(this);
        }
        this.startStepsCount = 0;
        this.prevStepsCount = 0;
        this.stepsCount = 0;
        this.totalDistance = 0;
        timer.cancel();
        timer.purge();
        this.status = this.STOPPED;
    }

    private HashMap<String, String> getDistanceParamsMap() {
        HashMap<String, String> map = new HashMap<String, String>();
        try {
            map.put("startDate", String.valueOf(this.startAt));
            map.put("endDate", String.valueOf(System.currentTimeMillis()));
            map.put("steps", String.valueOf(this.stepsCount));
            map.put("distance", String.valueOf(this.totalDistance));
        } catch (Exception e) {

        }
        return map;
    }

    private void sendDistanceUpdateEvent(@javax.annotation.Nullable HashMap<String, String> params) {
        LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(this);
        Intent pedometerEvent = new Intent("distance_update_event");
        pedometerEvent.putExtra("distance_data", params);
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

    @RequiresApi(Build.VERSION_CODES.O)
    private String createNotificationChannel(String channelId, String channelName) {
        NotificationChannel channel = new NotificationChannel(channelId,
                channelName, NotificationManager.IMPORTANCE_NONE);
        channel.setLightColor(Color.blue(1));
        channel.setLockscreenVisibility(Notification.VISIBILITY_PRIVATE);
        NotificationManager service = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        service.createNotificationChannel(channel);
        return channelId;
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private void startServiceAsForegroundService() {
        String channelId = "";
        channelId = createNotificationChannel("Fitlers", "Pedometer Background Service");
        Intent notificationIntent = new Intent(this, DistanceCalculationService.class);
        PendingIntent pendingIntent =
                PendingIntent.getActivity(this, 0, notificationIntent, 0);
        Notification notification = new Notification.Builder(this, channelId)
                .setContentTitle("Fitlers is using Step Data")
                .setSmallIcon(R.drawable.icon)
                .setContentIntent(pendingIntent)
                .setTicker("Fitlers")
                .build();
        startForeground(1, notification);
    }
}
