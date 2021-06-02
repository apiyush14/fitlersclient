package com.fitlers.fitlersapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.IllegalViewOperationException;

import java.util.HashMap;

public class AccelerometerJavaModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

    ReactApplicationContext reactApplicationContext;
    private AccelerometerJavaModule.LocalBroadcastReceiver mLocalBroadcastReceiver;
    private LocalBroadcastManager localBroadcastManager;

    public AccelerometerJavaModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);//required by React Native
        this.reactApplicationContext = reactApplicationContext;
        this.reactApplicationContext.addLifecycleEventListener(this);
        this.mLocalBroadcastReceiver = new AccelerometerJavaModule.LocalBroadcastReceiver();
    }

    @Override
    //getName is required to define the name of the module represented in JavaScript
    public String getName() {
        return "AccelerometerJavaModule";
    }


    @ReactMethod
    public void watchAccelerometerUpdates() {
        try {
            localBroadcastManager = LocalBroadcastManager.getInstance(reactApplicationContext);
            localBroadcastManager.registerReceiver(mLocalBroadcastReceiver, new IntentFilter("accelerometer_event"));
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                this.reactApplicationContext.startForegroundService(new Intent(this.reactApplicationContext, AccelerometerService.class));
            } else {
                this.reactApplicationContext.startService(new Intent(this.reactApplicationContext, AccelerometerService.class));
            }
        } catch (IllegalViewOperationException e) {

        }
    }

    @ReactMethod
    public void stopAccelerometerUpdates() {
        if(null!=localBroadcastManager&&null!=this.mLocalBroadcastReceiver) {
            localBroadcastManager.unregisterReceiver(this.mLocalBroadcastReceiver);
        }
        this.reactApplicationContext.stopService(new Intent(this.reactApplicationContext, AccelerometerService.class));
    }


    @Override
    public void onHostResume() {
    }

    @Override
    public void onHostPause() {
    }

    @Override
    public void onHostDestroy() {
        this.stopAccelerometerUpdates();
    }

    //Inner Class
    public class LocalBroadcastReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            HashMap<String, String> accelerationData = (HashMap<String, String>) intent.getSerializableExtra("acceleration_data");
            WritableMap mapStepsData = Arguments.createMap();
            mapStepsData.putDouble("x", Double.parseDouble(accelerationData.get("x")));
            mapStepsData.putDouble("y", Double.parseDouble(accelerationData.get("y")));
            mapStepsData.putDouble("z", Double.parseDouble(accelerationData.get("z")));
            reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("accelerometerDataDidUpdate", mapStepsData);
        }
    }
}