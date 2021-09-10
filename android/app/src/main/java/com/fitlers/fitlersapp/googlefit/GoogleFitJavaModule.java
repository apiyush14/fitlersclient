package com.fitlers.fitlersapp.googlefit;

import android.app.Activity;
import android.content.Intent;
import android.os.Build;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.util.CollectionUtils;
import com.google.android.gms.fitness.Fitness;
import com.google.android.gms.fitness.FitnessOptions;
import com.google.android.gms.fitness.data.Bucket;
import com.google.android.gms.fitness.data.DataPoint;
import com.google.android.gms.fitness.data.DataSet;
import com.google.android.gms.fitness.data.DataType;
import com.google.android.gms.fitness.data.Field;
import com.google.android.gms.fitness.request.DataReadRequest;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

public class GoogleFitJavaModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    Callback callback;

    public GoogleFitJavaModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);//required by React Native
        this.getReactApplicationContext().addActivityEventListener(this);
    }

    @Override
    //getName is required to define the name of the module represented in JavaScript
    public String getName() {
        return "GoogleFitJavaModule";
    }

    @ReactMethod
    public void hasPermissionsForGoogleFitAPI(Callback callback) {
        callback.invoke(hasPermissionsForGoogleFitAPIHelper());
    }

    @ReactMethod
    public void signInToGoogleFit(Callback callback) {
        this.callback = callback;
        FitnessOptions fitnessOptions = getFitnessOptions();
        GoogleSignInAccount googleSignInAccount = GoogleSignIn.getAccountForExtension(this.getReactApplicationContext(), fitnessOptions);
        GoogleSignIn.requestPermissions(
                this.getCurrentActivity(),
                2001,
                googleSignInAccount,
                fitnessOptions);
    }

    @ReactMethod
    public void signOutFromGoogleFit(Callback callback) {
        FitnessOptions fitnessOptions = getFitnessOptions();
        Fitness.getConfigClient(this.getReactApplicationContext(),
                GoogleSignIn.getAccountForExtension(this.getReactApplicationContext(), fitnessOptions))
                .disableFit()
                .addOnSuccessListener(response -> {
                    GoogleSignInOptions signInOptions = new GoogleSignInOptions.Builder()
                            .addExtension(fitnessOptions)
                            .build();
                    GoogleSignIn.getClient(this.getReactApplicationContext(), signInOptions)
                            .revokeAccess()
                            .addOnSuccessListener(res -> {
                                callback.invoke(false);
                            })
                            .addOnFailureListener(res -> {
                                callback.invoke(true);
                            });
                })
                .addOnFailureListener(response -> {
                    callback.invoke(false);
                });
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @ReactMethod
    public void fetchAllActivityForToday(Callback callback) {
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start = end.minusDays(1);
        long endSeconds = end.atZone(ZoneId.systemDefault()).toEpochSecond();
        long startSeconds = start.atZone(ZoneId.systemDefault()).toEpochSecond();
        GoogleSignInAccount account = GoogleSignIn.getAccountForExtension(this.getReactApplicationContext(), getFitnessOptions());
        DataReadRequest dataReadRequest = new DataReadRequest.Builder()
                .aggregate(DataType.AGGREGATE_DISTANCE_DELTA)
                .setTimeRange(startSeconds, endSeconds, TimeUnit.SECONDS)
                .bucketByActivitySegment(2, TimeUnit.MINUTES)
                .enableServerQueries()
                .build();

        Fitness.getHistoryClient(this.getReactApplicationContext(), account)
                .readData(dataReadRequest)
                .addOnSuccessListener(response ->
                        {
                            WritableMap result = Arguments.createMap();
                            if (!response.getBuckets().isEmpty()) {
                                for (Bucket bucket : response.getBuckets()) {
                                    if (!CollectionUtils.isEmpty(bucket.getDataSets())) {
                                        for (DataSet dataSet : bucket.getDataSets()) { //Will be single, since we are getting distance only
                                            WritableMap dataMap = Arguments.createMap();
                                            for (DataPoint dataPoint : dataSet.getDataPoints()) {
                                                //if(dataPoint.getOriginalDataSource().getDevice()!=null) {
                                                dataMap.putString("startTime", String.valueOf(dataPoint.getStartTime(TimeUnit.MILLISECONDS)));
                                                dataMap.putString("endTime", String.valueOf(dataPoint.getEndTime(TimeUnit.MILLISECONDS)));
                                                for (Field field : dataPoint.getDataType().getFields()) {
                                                    dataMap.putString(field.getName(), dataPoint.getValue(field).toString());
                                                }
                                                //}
                                            }
                                            //To eliminate manually inserted records
                                            if (dataMap.hasKey("startTime")) {
                                                result.putMap(bucket.getStartTime(TimeUnit.MILLISECONDS) + "", dataMap);
                                            }
                                        }
                                    }
                                }
                            }
                            callback.invoke(result);
                        }
                )
                .addOnFailureListener(e -> {
                });
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @ReactMethod
    public void fetchAllActivityForGivenTime(String startTime, String endTime, Callback callback) {
        GoogleSignInAccount account = GoogleSignIn.getAccountForExtension(this.getReactApplicationContext(), getFitnessOptions());
        DataReadRequest dataReadRequest = new DataReadRequest.Builder()
                .aggregate(DataType.AGGREGATE_DISTANCE_DELTA)
                .setTimeRange(Long.parseLong(startTime), Long.parseLong(endTime), TimeUnit.MILLISECONDS)
                .bucketByActivitySegment(2, TimeUnit.MINUTES)
                .enableServerQueries()
                .build();

        Fitness.getHistoryClient(this.getReactApplicationContext(), account)
                .readData(dataReadRequest)
                .addOnSuccessListener(response ->
                        {
                            WritableMap result = Arguments.createMap();
                            if (!response.getBuckets().isEmpty()) {
                                for (Bucket bucket : response.getBuckets()) {
                                    if (!CollectionUtils.isEmpty(bucket.getDataSets())) {
                                        for (DataSet dataSet : bucket.getDataSets()) { //Will be single, since we are getting distance only
                                            WritableMap dataMap = Arguments.createMap();
                                            for (DataPoint dataPoint : dataSet.getDataPoints()) {
                                                //System.out.println("Bucket : " + dataPoint.getStartTime(TimeUnit.MILLISECONDS)+" Start "+dataPoint.getEndTime(TimeUnit.MILLISECONDS));
                                                dataMap.putString("startTime", String.valueOf(dataPoint.getStartTime(TimeUnit.MILLISECONDS)));
                                                dataMap.putString("endTime", String.valueOf(dataPoint.getEndTime(TimeUnit.MILLISECONDS)));
                                                for (Field field : dataPoint.getDataType().getFields()) {
                                                    //System.out.println(field.getName() + " : " + dataPoint.getValue(field));
                                                    dataMap.putString(field.getName(), dataPoint.getValue(field).toString());
                                                }
                                            }
                                            result.putMap(bucket.getStartTime(TimeUnit.MILLISECONDS) + "", dataMap);
                                        }
                                    }
                                }
                            }
                            callback.invoke(result);
                        }
                )
                .addOnFailureListener(e -> {
                });
    }

    private boolean hasPermissionsForGoogleFitAPIHelper() {
        FitnessOptions fitnessOptions = getFitnessOptions();
        GoogleSignInAccount googleSignInAccount = GoogleSignIn.getAccountForExtension(this.getReactApplicationContext(), fitnessOptions);
        return !googleSignInAccount.isExpired();
    }

    private FitnessOptions getFitnessOptions() {
        FitnessOptions fitnessOptions = FitnessOptions.builder()
                .addDataType(DataType.TYPE_DISTANCE_DELTA, FitnessOptions.ACCESS_READ)
                .addDataType(DataType.AGGREGATE_DISTANCE_DELTA, FitnessOptions.ACCESS_READ).build();
        return fitnessOptions;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == 2001) {
            if (resultCode == Activity.RESULT_OK) {
                subscribeGoogleFitData();
                if (this.callback != null) {
                    this.callback.invoke(true);
                    this.callback = null;
                }
            } else {
                if (this.callback != null) {
                    this.callback.invoke(false);
                    this.callback = null;
                }
            }
        }
    }

    private void subscribeGoogleFitData() {
        GoogleSignInAccount googleSignInAccount = GoogleSignIn.getAccountForExtension(this.getReactApplicationContext(), getFitnessOptions());
        Fitness.getRecordingClient(this.getReactApplicationContext(), googleSignInAccount)
                .subscribe(DataType.AGGREGATE_DISTANCE_DELTA)
                .addOnSuccessListener((response) -> {
                })
                .addOnFailureListener((response) -> {
                });
    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}
