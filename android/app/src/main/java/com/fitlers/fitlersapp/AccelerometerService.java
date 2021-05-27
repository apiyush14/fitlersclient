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

import java.util.HashMap;

public class AccelerometerService extends Service implements SensorEventListener {

    public static int STOPPED = 0;
    public static int STARTING = 1;
    public static int RUNNING = 2;
    public static int ERROR_FAILED_TO_START = 3;

    private int status;     // status of listener

    SensorManager sensorManager;
    private Sensor mSensor;

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

        this.status = this.STOPPED;
        sensorManager = (SensorManager) this.getSystemService(Context.SENSOR_SERVICE);
        this.start();
        return START_STICKY;
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

        if (this.mSensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            sendAccelerometerUpdateEvent(getStepsParamsMap(event.values[0], event.values[1], event.values[2]));
        }
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

        this.status = this.STARTING;
        this.mSensor = this.sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

        // If found, then register as listener
        if (this.mSensor != null) {
            int sensorDelay = SensorManager.SENSOR_DELAY_NORMAL;
            if (this.sensorManager.registerListener(this, this.mSensor, sensorDelay)) {
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

    /**
     * Stop listening to sensor.
     */
    private void stop() {
        if (this.status != this.STOPPED) {
            this.sensorManager.unregisterListener(this);
        }
        this.status = this.STOPPED;
    }

    private HashMap<String, String> getStepsParamsMap(float x, float y, float z) {
        HashMap<String, String> map = new HashMap<String, String>();
        try {
            map.put("x", String.valueOf(x));
            map.put("y", String.valueOf(y));
            map.put("z", String.valueOf(z));
        } catch (Exception e) {

        }
        return map;
    }

    private void sendAccelerometerUpdateEvent(@javax.annotation.Nullable HashMap<String, String> params) {
        LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(this);
        Intent accelerometerEvent = new Intent("accelerometer_event");
        accelerometerEvent.putExtra("acceleration_data", params);
        localBroadcastManager.sendBroadcast(accelerometerEvent);
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
        Intent notificationIntent = new Intent(this, PedometerService.class);
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
