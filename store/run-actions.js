import {
  insertRun,
  fetchRuns,
  fetchRunSummary,
  updateRunSummary,
  insertRunSummary,
  updateRunsSyncState,
  deleteRuns
} from '../utils/DBUtils';
import * as FileSystem from 'expo-file-system';
import NetInfo from '@react-native-community/netinfo';
import {
  AsyncStorage
} from 'react-native';
import configData from "../config/config.json";
import {
  getUserAuthenticationToken
} from '../utils/AuthenticationUtils';

export const UPDATE_RUN_DETAILS = 'UPDATE_RUN_DETAILS';
export const UPDATE_RUN_SUMMARY = 'UPDATE_RUN_SUMMARY';
export const UPDATE_RUN_SYNC_STATE = 'UPDATE_RUN_SYNC_STATE';

//Method to add a new Run to Local DB and to server
export const addRun = (runId, runTotalTime, runDistance, runPace, runCaloriesBurnt, runCredits, runStartDateTime, runDate, runDay, runPath, runTrackSnapUrl) => {
  return async dispatch => {
    var userId = await AsyncStorage.getItem('USER_ID');
    return new Promise((resolve, reject) => {

      dispatch(checkAndDeleteRunsIfNeeded());

      var pathString = runPath.map((path) => "" + path.latitude + "," + path.longitude).join(';');
      var filePathPrefix = "file://";
      var filePath = filePathPrefix.concat(runTrackSnapUrl.toString());

      // Insert New Run
      insertRun(runId, runTotalTime.toString(), runDistance.toString(), runPace.toString(), runCaloriesBurnt.toString(), 0, runStartDateTime.toString(), runDate.toString(), runDay.toString(), pathString, runTrackSnapUrl.toString(), "0").then(
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
        reject(err);
      });
    });
  }
};

//Method to Add Run Summary in Local DB
export const addRunSummary = (run) => {
  return async dispatch => {
    return new Promise((resolve, reject) => {
      fetchRunSummary().then((response) => {

        //Insert New Run Summary
        if (response.rows._array.length === 0) {
          insertRunSummary(run.runDistance, "1", run.runPace, run.runDistance).then((response) => {
            //Dispatch Update Run Summary State
            dispatch({
              type: UPDATE_RUN_SUMMARY,
              runSummary: {
                totalDistance: response.TOTAL_DISTANCE,
                totalRuns: response.TOTAL_RUNS,
                averagePace: response.AVERAGE_PACE,
                averageDistance: response.AVERAGE_DISTANCE
              }
            });
          });
        } 
        // Update Existing Run Summary
        else {
          var updatedRunSummary = {
            totalDistance: parseFloat(response.rows._array[0].TOTAL_DISTANCE) + parseFloat(run.runDistance),
            totalRuns: parseInt(response.rows._array[0].TOTAL_RUNS) + 1,
            averagePace: ((parseFloat(response.rows._array[0].AVERAGE_PACE) * parseInt(response.rows._array[0].TOTAL_RUNS)) + run.runPace) / (parseInt(response.rows._array[0].TOTAL_RUNS) + 1),
            averageDistance: response.rows._array[0].TOTAL_DISTANCE / response.rows._array[0].TOTAL_RUNS
          };
          //Dispatch Update Run Summary State
          updateRunSummary(updatedRunSummary.totalDistance, updatedRunSummary.totalRuns, updatedRunSummary.averagePace, updatedRunSummary.averageDistance).then((response) => {
            dispatch({
              type: UPDATE_RUN_SUMMARY,
              runSummary: {
                totalDistance: updatedRunSummary.totalDistance,
                totalRuns: updatedRunSummary.totalRuns,
                averagePace: updatedRunSummary.averagePace,
                averageDistance: updatedRunSummary.averageDistance
              }
            });
          });
        }
        resolve();
      }).catch(err => {
        reject(err);
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
                runSyncDone: run.IS_SYNC_DONE
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
                  insertRun(run.runId, run.runTotalTime.toString(), run.runDistance.toString(), run.runPace.toString(), run.runCaloriesBurnt.toString(), 0, run.runStartDateTime.toString(), run.runDate.toString(), run.runDay.toString(), run.runPath.toString(), run.runTrackSnapUrl.toString(), "1");
                });
              }
            });
          }
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};

//Method to Load Runs from server based on pageNumber provided
export const loadRunsFromServer = (pageNumber) => {
  return async dispatch => {
    var header = await dispatch(getUserAuthenticationToken());
    var userId = await AsyncStorage.getItem('USER_ID');
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          reject(201);
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
          reject(err);
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
                averagePace: dbResultSummary.AVERAGE_PACE,
                averageDistance: dbResultSummary.AVERAGE_DISTANCE
              }
            });
          } else {
            //Dispatch Load Run Summary from Server
            dispatch(loadRunSummaryFromServer());
          }
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};

//Load Run Summary from Server and hydrate local DB
export const loadRunSummaryFromServer = () => {
  return async dispatch => {
    var header = await dispatch(getUserAuthenticationToken());
    var userId = await AsyncStorage.getItem('USER_ID');
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          reject(201);
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
            insertRunSummary(response.runSummary.totalDistance, response.runSummary.totalRuns, response.runSummary.averagePace, response.runSummary.averageDistance);
          }
          resolve();
        }).catch(err => {
          reject(err);
        });
    });
  }
};

export const syncPendingRuns = (pendingRunsForSync) => {

  console.log('Inside Sync Pending Runs');
  console.log(pendingRunsForSync);

  return async dispatch => {

    var header = await dispatch(getUserAuthenticationToken());
    var userId = await AsyncStorage.getItem('USER_ID');
    return new Promise((resolve, reject) => {
      //console.log('Inside dispatch');
      //console.log(pendingRunsForSync);

      /* let runDataArr=[];
       pendingRunsForSync.map(pendingRun=>{
        var pathString=pendingRun.runPath.map((path)=>""+path.latitude+","+path.longitude).join(';');
        const runData={
          runId: pendingRun.runId,
          userId: userId,
          runTotalTime: pendingRun.runTotalTime,
          runDistance: pendingRun.runDistance,
          runPace: pendingRun.runPace,
          runCaloriesBurnt: pendingRun.runCaloriesBurnt,
          runCredits: '0',
          runStartDateTime: pendingRun.runStartDateTime,
          runDate: pendingRun.runDate,
          runDay: pendingRun.runDay,
          runPath: pathString,
          runTrackSnapUrl: pendingRun.runTrackSnapUrl
        };
        runDataArr = runDataArr.concat(runData);
       });*/

      //console.log('Run Request');
      //console.log(runDataArr);
      /*const addRunsRequest={
        runDetailsList: pendingRunsForSync
      };*/
      var URL = configData.SERVER_URL + "run-details/addRuns/" + userId;
      fetch(URL, {
          method: 'POST',
          headers: header,
          body: JSON.stringify({
            runDetailsList: pendingRunsForSync
          })
        }).then(response => response.json())
        .then((response) => {
          updateSyncStateInDB(pendingRunsForSync);
          dispatch({
            type: UPDATE_RUN_SYNC_STATE,
            pendingRunsForSync
          });
          resolve();
        }).catch(err => {
          reject(err);
        });
    });
  }
};

const updateSyncStateInDB = (pendingRunsForSync) => {
  let pendingRunIds = "";
  pendingRunsForSync.map(pendingRun => {
    pendingRunIds = pendingRunIds + pendingRunsForSync.runId + ",";
  });
  pendingRunIds = pendingRunIds.replace(/(^[,\s]+)|([,\s]+$)/g, '');
  try {
    const dbResult = updateRunsSyncState(pendingRunIds);
  } catch (err) {

  }
};

//Utility Method to Check and Delete Synced Runs from Local Database
const checkAndDeleteRunsIfNeeded = () => {
  return async dispatch => {
    return new Promise((resolve, reject) => {
      fetchRuns().then((response) => {
        if (response && response.rows._array.length > 2) {
          var runsToBeDeleted;
          let runIdsToBeDeleted = "";
          existingRuns.rows._array.sort(function(a, b) {
            return new Date(b.RUN_START_DATE_TIME) - new Date(a.RUN_START_DATE_TIME);
          });

          for (runsToBeDeleted = existingRuns.rows._array.length - 2; runsToBeDeleted > 0; runsToBeDeleted--) {
            //Delete Only if the Run has already been synced to server
            if (runsToBeDeleted.IS_SYNC_DONE === '1') {
              runIdsToBeDeleted = runIdsToBeDeleted + existingRuns.rows._array[existingRuns.rows._array.length - runsToBeDeleted].RUN_ID + ",";
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
