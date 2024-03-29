package com.fitlers.fitlersapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.os.Build;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.IllegalViewOperationException;

import java.io.File;
import java.io.FileWriter;
import java.util.HashMap;

public class DistanceCalculatorModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

    ReactApplicationContext reactApplicationContext;
    SensorManager sensorManager;

    private LocalBroadcastReceiver mLocalBroadcastReceiver;
    private LocalBroadcastManager localBroadcastManager;

    public static int userHeight=182;

    public DistanceCalculatorModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);//required by React Native
        this.reactApplicationContext = reactApplicationContext;
        this.reactApplicationContext.addLifecycleEventListener(this);
        sensorManager = (SensorManager) this.reactApplicationContext.getSystemService(Context.SENSOR_SERVICE);
        this.mLocalBroadcastReceiver = new LocalBroadcastReceiver();
    }

    @Override
    //getName is required to define the name of the module represented in JavaScript
    public String getName() {
        return "DistanceCalculatorModule";
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
    public void watchDistanceUpdates(int userHeight) {
        try {
            this.userHeight=userHeight;
            localBroadcastManager = LocalBroadcastManager.getInstance(reactApplicationContext);
            localBroadcastManager.registerReceiver(mLocalBroadcastReceiver, new IntentFilter("distance_update_event"));
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                this.reactApplicationContext.startForegroundService(new Intent(this.reactApplicationContext, DistanceCalculationService.class));
            } else {
                this.reactApplicationContext.startService(new Intent(this.reactApplicationContext, DistanceCalculationService.class));
            }
        } catch (IllegalViewOperationException e) {

        }
    }

    @ReactMethod
    public void stopDistanceUpdates() {
        if (null != localBroadcastManager && null != this.mLocalBroadcastReceiver) {
            localBroadcastManager.unregisterReceiver(this.mLocalBroadcastReceiver);
        }
        this.reactApplicationContext.stopService(new Intent(this.reactApplicationContext, DistanceCalculationService.class));
    }

    @ReactMethod
    public void createFile(String fileName, String data) {
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
        } catch (Exception e) {

        }
    }

    @Override
    public void onHostResume() {
    }

    @Override
    public void onHostPause() {
    }

    @Override
    public void onHostDestroy() {
        this.stopDistanceUpdates();
    }

    //Inner Class
    public class LocalBroadcastReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            HashMap<String, String> stepsData = (HashMap<String, String>) intent.getSerializableExtra("distance_data");
            WritableMap mapStepsData = Arguments.createMap();
            mapStepsData.putString("startDate", stepsData.get("startDate"));
            mapStepsData.putString("endDate", stepsData.get("endDate"));
            mapStepsData.putDouble("steps", Double.parseDouble(stepsData.get("steps")));
            mapStepsData.putDouble("distance", Double.parseDouble(stepsData.get("distance")));
            mapStepsData.putDouble("changeInDistance", Double.parseDouble(stepsData.get("changeInDistance")));
            reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("distanceDataDidUpdate", mapStepsData);
        }
    }
}