import {insertRun,fetchRuns,fetchRunSummary,updateRunSummary,insertRunSummary,updateRunsSyncState,deleteRuns} from '../utils/DBUtils';
import * as FileSystem from 'expo-file-system';
import NetInfo from '@react-native-community/netinfo';
import {AsyncStorage} from 'react-native';
import configData from "../config/config.json";
import {getUserAuthenticationToken} from '../utils/AuthenticationUtils';
import RunDetails from '../models/rundetails';

export const UPDATE_RUN_DETAILS = 'UPDATE_RUN_DETAILS';
export const UPDATE_RUN_SUMMARY = 'UPDATE_RUN_SUMMARY';
export const UPDATE_RUN_SYNC_STATE = 'UPDATE_RUN_SYNC_STATE';

//Method to add a new Run to Local DB and to server
export const addRun = (runId, runTotalTime, runDistance, runPace, runCaloriesBurnt, runCredits, runStartDateTime, runDate, runDay, runPath, runTrackSnapUrl, eventId) => {
  return async dispatch => {
    var userId = await AsyncStorage.getItem('USER_ID');
    return new Promise((resolve, reject) => {

      dispatch(checkAndDeleteRunsIfNeeded());

      var pathString = runPath.map((path) => "" + path.latitude + "," + path.longitude).join(';');
      var filePathPrefix = "file://";
      var filePath = filePathPrefix.concat(runTrackSnapUrl.toString());

      // Insert New Run
      insertRun(runId, runTotalTime.toString(), runDistance.toString(), runPace.toString(), runCaloriesBurnt.toString(), 0, runStartDateTime.toString(), runDate.toString(), runDay.toString(), pathString, runTrackSnapUrl.toString(), eventId,"0").then(
        (response) => {
          var updatedRuns = [];
          var run = {
            runId: runId,
            userId: userId,
            runTotalTime: runTotalTime,
            runDistance: runDistance,
            runPace: runPace,
            runCaloriesBurnt: runCaloriesBurnt,
            runCredits: runCredits,
            runStartDateTime: runStartDateTime,
            runDate: runDate,
            runDay: runDay,
            runPath: pathString,
            runTrackSnapUrl: runTrackSnapUrl,
            eventId: eventId,
            isSyncDone: "0"
          };
          updatedRuns = updatedRuns.concat(run);
          //Dispatch Update Runs State
          dispatch({
            type: UPDATE_RUN_DETAILS,
            runs: updatedRuns
          });
          //Dispatch Add Run Summary
          dispatch(addRunSummary(run));
          //Dispatch Sync New Run to Server
          dispatch(syncPendingRuns(updatedRuns));
          resolve();
        }
      ).catch(err => {
        //reject(err);
      });
    });
  }
};

//Method to Add Run Summary in Local DB
export const addRunSummary = (run) => {
  return async dispatch => {
    return new Promise((resolve, reject) => {
      fetchRunSummary().then((response) => {
         console.log('===========Add Run Summary=================');
         console.log(response);
        //Insert New Run Summary
        if (response.rows._array.length === 0) {
          insertRunSummary(run.runDistance, "1",run.runCredits, run.runPace, run.runDistance, run.runCaloriesBurnt).then((response) => {
            //Dispatch Update Run Summary State
            dispatch({
              type: UPDATE_RUN_SUMMARY,
              runSummary: {
                totalDistance: run.runDistance,
                totalRuns: "1",
                totalCredits: run.runCredits,
                averagePace: run.runPace,
                averageDistance: run.runDistance,
                averageCaloriesBurnt: run.runCaloriesBurnt
              }
            });
          });
        }
        // Update Existing Run Summary
        else {
          var updatedRunSummary = {
            totalDistance: parseFloat(response.rows._array[0].TOTAL_DISTANCE) + parseFloat(run.runDistance),
            totalRuns: parseInt(response.rows._array[0].TOTAL_RUNS) + 1,
            totalCredits: parseFloat(response.rows._array[0].TOTAL_CREDITS) + parseFloat(run.runCredits),
            averagePace: ((parseFloat(response.rows._array[0].AVERAGE_PACE) * parseInt(response.rows._array[0].TOTAL_RUNS)) + run.runPace) / (parseInt(response.rows._array[0].TOTAL_RUNS) + 1),
            averageDistance: ((parseFloat(response.rows._array[0].AVERAGE_DISTANCE) * parseInt(response.rows._array[0].TOTAL_RUNS)) + run.runDistance) / (parseInt(response.rows._array[0].TOTAL_RUNS) + 1),
            averageCaloriesBurnt: ((parseFloat(response.rows._array[0].AVERAGE_CALORIES_BURNT) * parseInt(response.rows._array[0].TOTAL_RUNS)) + run.runCaloriesBurnt) / (parseInt(response.rows._array[0].TOTAL_RUNS) + 1)
          };
          //Dispatch Update Run Summary State
          updateRunSummary(updatedRunSummary.totalDistance, updatedRunSummary.totalRuns,updatedRunSummary.totalCredits ,updatedRunSummary.averagePace, updatedRunSummary.averageDistance, updatedRunSummary.averageCaloriesBurnt).then((response) => {
            dispatch({
              type: UPDATE_RUN_SUMMARY,
              runSummary: {
                totalDistance: updatedRunSummary.totalDistance,
                totalRuns: updatedRunSummary.totalRuns,
                totalCredits: updatedRunSummary.totalCredits,
                averagePace: updatedRunSummary.averagePace,
                averageDistance: updatedRunSummary.averageDistance,
                averageCaloriesBurnt: updatedRunSummary.averageCaloriesBurnt
              }
            });
          });
        }
        resolve();
      }).catch(err => {
        //reject(err);
      });
    });
  }
};

//Method to Load Runs first from local DB, and then from server in case needed and hydrate local DB
export const loadRuns = () => {
  return async dispatch => {
    return new Promise((resolve, reject) => {
      //Fetch Runs from Local DB
      fetchRuns().then(response => {
          if (response.rows._array.length > 0) {
            var updatedRuns = response.rows._array.map((run) => {
              var updatedRun = {
                runId: run.RUN_ID,
                runTotalTime: run.RUN_TOTAL_TIME,
                runDistance: run.RUN_DISTANCE,
                runPace: run.RUN_PACE,
                runCaloriesBurnt: run.RUN_CALORIES_BURNT,
                runCredits: run.RUN_CREDITS,
                runStartDateTime: run.RUN_START_DATE_TIME,
                runDate: run.RUN_DATE,
                runDay: run.RUN_DAY,
                runPath: run.RUN_PATH,
                runTrackSnapUrl: run.RUN_TRACK_SNAP_URL,
                eventId: run.EVENT_ID,
                isSyncDone: run.IS_SYNC_DONE
              };
              return updatedRun;
            });

            //Dispatch Runs Update State
            dispatch({
              type: UPDATE_RUN_DETAILS,
              runs: updatedRuns
            });
          } else {
            //Dispatch Load Runs from Server Action
            dispatch(loadRunsFromServer(0)).then((response) => {
              if (response.runDetailsList.length > 0) {
                response.runDetailsList.map((run) => {
                  //Hydrate Local DB
                  insertRun(run.runId, run.runTotalTime.toString(), run.runDistance.toString(), run.runPace.toString(), run.runCaloriesBurnt.toString(), 0, run.runStartDateTime.toString(), run.runDate.toString(), run.runDay.toString(), run.runPath.toString(), run.runTrackSnapUrl.toString(),run.eventId ,"1");
                });
              }
            });
          }
          resolve(response);
        })
        .catch(err => {

        });
    });
  }
};

//Method to Load Runs from server based on pageNumber provided
export const loadRunsFromServer = (pageNumber) => {
  return async dispatch => {
    var header = await dispatch(getUserAuthenticationToken());
    var userId = header.USER_ID;
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          //reject(201);
        }
      });
      var URL = configData.SERVER_URL + "run-details/getRuns/" + userId + "?page=";
      URL = URL + pageNumber;
      fetch(URL, {
          method: 'GET',
          headers: header
        }).then(response => response.json())
        .then((response) => {
          if (response.runDetailsList.length > 0) {
            //Dispatch Runs Update State
            dispatch({
              type: UPDATE_RUN_DETAILS,
              runs: response.runDetailsList
            })
          }
          resolve(response);
        }).catch(err => {
          resolve({isMoreContentAvailable: false});
          //reject(err);
        });
    });
  }
};

//Method to load Run Summary first from local DB, and then from server in case needed
export const loadRunSummary = () => {
  return async dispatch => {
    return new Promise((resolve, reject) => {
      //Fetch Run Summary from Local DB
      fetchRunSummary().then(response => {
          if (response.rows._array.length > 0) {
            var dbResultSummary = response.rows._array[0];
            //Dispatch Run Summary State Update
            dispatch({
              type: UPDATE_RUN_SUMMARY,
              runSummary: {
                id: dbResultSummary.id,
                totalDistance: dbResultSummary.TOTAL_DISTANCE,
                totalRuns: dbResultSummary.TOTAL_RUNS,
                totalCredits: dbResultSummary.TOTAL_CREDITS,
                averagePace: dbResultSummary.AVERAGE_PACE,
                averageDistance: dbResultSummary.AVERAGE_DISTANCE,
                averageCaloriesBurnt: dbResultSummary.AVERAGE_CALORIES_BURNT
              }
            });
          } else {
            //Dispatch Load Run Summary from Server
            dispatch(loadRunSummaryFromServer());
          }
          resolve();
        })
        .catch(err => {
          //reject(err);
        });
    });
  }
};

//Load Run Summary from Server and hydrate local DB
export const loadRunSummaryFromServer = () => {
  return async dispatch => {
    var header = await dispatch(getUserAuthenticationToken());
    var userId = header.USER_ID;
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          //reject(201);
        }
      });
      var URL = configData.SERVER_URL + "run-details/getRunSummary/" + userId;
      fetch(URL, {
          method: 'GET',
          headers: header
        }).then(response => response.json())
        .then((response) => {
          if (response && response.runSummary !== null) {
            //Dispatch Run Summary State Update
            dispatch({
              type: UPDATE_RUN_SUMMARY,
              runSummary: response.runSummary
            });
            //Hydrate the database
            insertRunSummary(response.runSummary.totalDistance, response.runSummary.totalRuns,response.runSummary.totalCredits, response.runSummary.averagePace, response.runSummary.averageDistance, response.runSummary.averageCaloriesBurnt);
          }
          resolve();
        }).catch(err => {
          //reject(err);
        });
    });
  }
};

export const syncPendingRuns = (pendingRunsForSync) => {

  return async dispatch => {
    var header = await dispatch(getUserAuthenticationToken());
    var userId = header.USER_ID;

    return new Promise((resolve, reject) => {
      var pendingRunsForSyncRequest = pendingRunsForSync.map(pendingRun => {
        if (Array.isArray(pendingRun.runPath)) {
          var pathString = pendingRun.runPath.map((path) => "" + path.latitude + "," + path.longitude).join(';');
          var runDetails = new RunDetails(pendingRun.runId, pendingRun.runTotalTime, pendingRun.runDistance, pendingRun.runPace, pendingRun.runCaloriesBurnt, pendingRun.runCredits, pendingRun.runStartDateTime, pendingRun.runDate, pendingRun.runDay, pathString, pendingRun.runTrackSnapUrl, pendingRun.eventId, pendingRun.isSyncDone);
          runDetails.userId = userId;
          return runDetails;
        }
      });

      var URL = configData.SERVER_URL + "run-details/addRuns/" + userId;
      fetch(URL, {
          method: 'POST',
          headers: header,
          body: JSON.stringify({
            runDetailsList: pendingRunsForSyncRequest
          })
        }).then(response => response.json())
        .then((response) => {
          if (response === true) {
            updateSyncStateInDB(pendingRunsForSync);
            dispatch({
              type: UPDATE_RUN_SYNC_STATE,
              pendingRunsForSync
            });
          }
          resolve();
        }).catch(err => {
          //reject(err);
        });
    });
  }
};

const updateSyncStateInDB = (pendingRunsForSync) => {
  let pendingRunIds = "";
  pendingRunsForSync.map(pendingRun => {
    pendingRunIds = pendingRunIds + pendingRun.runId + ",";
  });
  pendingRunIds = pendingRunIds.replace(/(^[,\s]+)|([,\s]+$)/g, '');
  updateRunsSyncState(pendingRunIds);
};

//Utility Method to Check and Delete Synced Runs from Local Database
const checkAndDeleteRunsIfNeeded = () => {
  return async dispatch => {
    return new Promise((resolve, reject) => {
      fetchRuns().then((response) => {

        if (response && response.rows._array.length > 2) {
          var runsToBeDeleted;
          let runIdsToBeDeleted = "";
          response.rows._array.sort(function(a, b) {
            return new Date(b.RUN_START_DATE_TIME) - new Date(a.RUN_START_DATE_TIME);
          });

          for (runsToBeDeleted = response.rows._array.length - 1; runsToBeDeleted > 2; runsToBeDeleted--) {
            //Delete Only if the Run has already been synced to server
            if (response.rows._array[runsToBeDeleted].IS_SYNC_DONE === "1") {
              runIdsToBeDeleted = runIdsToBeDeleted + response.rows._array[runsToBeDeleted].RUN_ID + ",";
            }
          }
          if (runIdsToBeDeleted !== "") {
            runIdsToBeDeleted = runIdsToBeDeleted.replace(/(^[,\s]+)|([,\s]+$)/g, '');
            deleteRuns(runIdsToBeDeleted).then((response) => {
              resolve();
            }).catch(err => {
              //No Need to throw exception
              resolve();
            });
          }
        }
      }).catch(err => {
        //No Need to throw exception
        resolve();
      });
    });
  };
};