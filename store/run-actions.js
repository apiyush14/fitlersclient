import {insertRun,fetchRuns,fetchRunSummary,updateRunSummary,insertRunSummary,updateRunsSyncState,deleteRuns,fetchEventDetailsBasedOnEventId,updateEventIdInRunDetails} from '../utils/DBUtils';
import NetInfo from '@react-native-community/netinfo';
import {AsyncStorage} from 'react-native';
import configData from "../config/config.json";
import {getUserAuthenticationToken} from '../utils/AuthenticationUtils';
import RunDetails from '../models/rundetails';
import Response from '../models/response';
import * as userActions from '../store/user-actions';
import * as eventActions from '../store/event-actions';

export const UPDATE_RUN_DETAILS = 'UPDATE_RUN_DETAILS';
export const UPDATE_RUN_SUMMARY = 'UPDATE_RUN_SUMMARY';
export const UPDATE_RUN_SYNC_STATE = 'UPDATE_RUN_SYNC_STATE';
export const CLEAN_RUN_STATE = 'CLEAN_RUN_STATE';
export const UPDATE_EVENT_ID_RUN_DETAILS = 'UPDATE_EVENT_ID_RUN_DETAILS';

//Method to add a new Run to Local DB and to server
export const addRun = (runDetailsVar) => {
  return async dispatch => {
    var runDetails = new RunDetails(runDetailsVar.runId, runDetailsVar.runTotalTime, runDetailsVar.runDistance, runDetailsVar.runPace, runDetailsVar.runCaloriesBurnt, runDetailsVar.runCredits, runDetailsVar.runStartDateTime, runDetailsVar.runDate, runDetailsVar.runDay, runDetailsVar.runPath, runDetailsVar.runTrackSnapUrl, runDetailsVar.eventId, runDetailsVar.isSyncDone);
    var userId = await AsyncStorage.getItem('USER_ID');

    var isEventRun = runDetails.eventId > 0;
    var isRunEligibleForSubmissionStatus = 200;

    //Async Method to Delete Runs from Local DB if required
    dispatch(checkAndDeleteRunsIfNeeded());

    if (isEventRun) {
      var isRunEligibleResponse = await dispatch(validateIfRunEligibleForEventSubmission(runDetails));
      if (isRunEligibleResponse.status >= 400) {
        isRunEligibleForSubmissionStatus = isRunEligibleResponse.status;
        runDetails.eventId = 0;
      }
    }

    var pathString = "";
    if (runDetails.runPath.length > 0) {
      pathString = runDetails.runPath.map((path) => "" + path.latitude + "," + path.longitude).join(';');
    }

    // Insert New Run in Local DB
    return insertRun(runDetails.runId, runDetails.runTotalTime.toString(), runDetails.runDistance.toString(), runDetails.runPace.toString(), runDetails.runCaloriesBurnt.toString(), runDetails.runCredits.toString(), runDetails.runStartDateTime.toString(), runDetails.runDate.toString(), runDetails.runDay.toString(), pathString, runDetails.runTrackSnapUrl.toString(), runDetails.eventId, runDetails.isSyncDone.toString()).then(
      (response) => {
        var updatedRuns = [];
        runDetails.userId = userId;
        runDetails.runPath = pathString;
        updatedRuns = updatedRuns.concat(runDetails);
        //Async Dispatch Update Runs State
        dispatch({
          type: UPDATE_RUN_DETAILS,
          runs: updatedRuns
        });
        //Async Dispatch Add Run Summary
        dispatch(addRunSummary(runDetails));

        if (isEventRun && isRunEligibleForSubmissionStatus === 200) {
          //Async Update Run Details in Event Registration
          dispatch(eventActions.updateRunDetailsInEventRegistration(runDetails.eventId, runDetails.runId));

        }
        //Async Dispatch Sync New Run to Server
        return dispatch(syncPendingRuns(updatedRuns)).then((response) => {
          if (isRunEligibleForSubmissionStatus >= 400) {
            return new Response(isRunEligibleForSubmissionStatus, null);
          } else if (response.status >= 400) {
            return new Response(response.status, null);
          } else {
            return new Response(200, updatedRuns);
          }
        });
      }
    ).catch(err => {
      return new Response(500, null);
    });
  }
};

//Method to Add Run Summary in Local DB
export const addRunSummary = (run) => {
  return async dispatch => {
    return fetchRunSummary().then((response) => {
      //Insert New Run Summary
      if (response.rows._array.length === 0) {
        insertRunSummary(run.runDistance, "1", run.runCredits, run.runPace, run.runDistance, run.runCaloriesBurnt).then((response) => {
          //Async Dispatch Update Run Summary State
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
        //Dispatch Update Run Summary in Local DB
        updateRunSummary(updatedRunSummary.totalDistance, updatedRunSummary.totalRuns, updatedRunSummary.totalCredits, updatedRunSummary.averagePace, updatedRunSummary.averageDistance, updatedRunSummary.averageCaloriesBurnt).then((response) => {
          //Async Dispatch Update Run State
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
      return new Response(200, run);
    }).catch(err => {
      return new Response(500, null);
    });
  }
};

//Async Method to Load Runs first from local DB, and then from server in case needed and hydrate local DB
export const loadRuns = () => {
  return async dispatch => {
    //Fetch Runs from Local DB
    fetchRuns().then(response => {
        //In case Local DB has some data
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

          //Async Dispatch Runs Update State
          dispatch({
            type: UPDATE_RUN_DETAILS,
            runs: updatedRuns
          });
        }
        //In case there is no data in local store, go to server
        else {
          //Async Dispatch Load Runs from Server Action
          dispatch(loadRunsFromServer(0)).then((response) => {
            if (response.status >= 400) {
              //Do nothing
            } else if (response.data.runDetailsList.length > 0) {
              response.data.runDetailsList.map((run) => {
                //Hydrate Local DB
                insertRun(run.runId, run.runTotalTime.toString(), run.runDistance.toString(), run.runPace.toString(), run.runCaloriesBurnt.toString(), 0, run.runStartDateTime.toString(), run.runDate.toString(), run.runDay.toString(), run.runPath.toString(), run.runTrackSnapUrl.toString(), run.eventId, "1");
              });
            }
          });
        }
      })
      .catch(err => {

      });
  }
};

//Method to Load Runs from server based on pageNumber provided
export const loadRunsFromServer = (pageNumber) => {
  return async dispatch => {
    var header = await dispatch(getUserAuthenticationToken());
    var userId = header.USER_ID;

    var networkStatus = await NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        return new Response(452, null);
      }
    });
    if (networkStatus) {
      return networkStatus;
    }

    var URL = configData.SERVER_URL + "run-details/getRuns/" + userId + "?page=";
    URL = URL + pageNumber;
    return fetch(URL, {
        method: 'GET',
        headers: header
      }).then(response => response.json())
      .then((response) => {
        if (response.status >= 400) {
          if (response.message && response.message.includes("UNAUTHORIZED")) {
            dispatch(userActions.cleanUserDataStateAndDB());
          }
          return {
            status: response.status
          };
        } else if (response.runDetailsList.length > 0) {
          //Async Dispatch Runs Update State
          dispatch({
            type: UPDATE_RUN_DETAILS,
            runs: response.runDetailsList
          })
        }
        return new Response(200, response);
      }).catch(err => {
        return new Response(500, null);
      });
  }
};

//Method to load Run Summary first from local DB, and then from server in case needed
export const loadRunSummary = () => {
  return async dispatch => {
    //Fetch Run Summary from Local DB
    fetchRunSummary().then(response => {
        if (response.rows._array.length > 0) {
          var dbResultSummary = response.rows._array[0];
          //Async Dispatch Run Summary State Update
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
          //Async Dispatch Load Run Summary from Server
          dispatch(loadRunSummaryFromServer());
        }
      })
      .catch(err => {

      });
  }
};

//Load Run Summary from Server and hydrate local DB and update state
export const loadRunSummaryFromServer = () => {
  return async dispatch => {
    var header = await dispatch(getUserAuthenticationToken());
    var userId = header.USER_ID;

    var networkStatus = await NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        return new Response(452, null);
      }
    });
    if (networkStatus) {
      return networkStatus;
    }

    var URL = configData.SERVER_URL + "run-details/getRunSummary/" + userId;
    return fetch(URL, {
        method: 'GET',
        headers: header
      }).then(response => response.json())
      .then((response) => {
        if (response.status >= 400) {
          if (response.message && response.message.includes("UNAUTHORIZED")) {
            dispatch(userActions.cleanUserDataStateAndDB());
          }
          return new Response(response.status, null);
        } else if (response.runSummary !== null) {
          //Async Dispatch Run Summary State Update
          dispatch({
            type: UPDATE_RUN_SUMMARY,
            runSummary: response.runSummary
          });
          //Async Hydrate the database
          insertRunSummary(response.runSummary.totalDistance, response.runSummary.totalRuns, response.runSummary.totalCredits, response.runSummary.averagePace, response.runSummary.averageDistance, response.runSummary.averageCaloriesBurnt);
        }
        return new Response(200, response);
      }).catch(err => {
        return new Response(500, null);
      });
  }
};

//Method to Sync Pending Runs with Server
export const syncPendingRuns = (pendingRunsForSync) => {

  return async dispatch => {
    var header = await dispatch(getUserAuthenticationToken());
    var userId = header.USER_ID;

    var networkStatus = await NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        return new Response(452, null);
      }
    });
    if (networkStatus) {
      return networkStatus;
    }

    var eventEligibleStatus = 200;

    var pendingRunsForSyncRequest = pendingRunsForSync.map(pendingRun => {
      var pathString = pendingRun.runPath;
      if (Array.isArray(pendingRun.runPath)) {
        pathString = pendingRun.runPath.map((path) => "" + path.latitude + "," + path.longitude).join(';');
      }
      var isEventRun = pendingRun.eventId > 0;
      if (isEventRun) {
        var isRunEligibleResponse = dispatch(validateIfRunEligibleForEventSubmission(pendingRun));
        if (isRunEligibleResponse.status >= 400) {
          eventEligibleStatus = isRunEligibleResponse.status;
          pendingRun.eventId = 0;
          //Update Local Run Details State
          dispatch(updateEventIdInDB(pendingRun, 0));
          //Async Run State Update
          dispatch({
            type: UPDATE_EVENT_ID_RUN_DETAILS,
            pendingRunForSync: pendingRun
          });
        }
      }
      var runDetails = new RunDetails(pendingRun.runId, pendingRun.runTotalTime, pendingRun.runDistance, pendingRun.runPace, pendingRun.runCaloriesBurnt, pendingRun.runCredits, pendingRun.runStartDateTime, pendingRun.runDate, pendingRun.runDay, pathString, pendingRun.runTrackSnapUrl, pendingRun.eventId, pendingRun.isSyncDone);
      runDetails.userId = userId;
      return runDetails;
    });

    var URL = configData.SERVER_URL + "run-details/addRuns/" + userId;
    return fetch(URL, {
        method: 'POST',
        headers: header,
        body: JSON.stringify({
          runDetailsList: pendingRunsForSyncRequest
        })
      }).then(response => response.json())
      .then((response) => {
        if (response.status >= 400) {
          if (response.message && response.message.includes("UNAUTHORIZED")) {
            dispatch(userActions.cleanUserDataStateAndDB());
          }
          return new Response(response.status, null);
        } else if (response === true) {
          //Async Update Sync Flag in Local DB
          return dispatch(updateSyncStateInDB(pendingRunsForSync)).then((response) => {
            if (response.status >= 400) {
              return new Response(response.status, null);
            } else {
              //Async Run State Update
              dispatch({
                type: UPDATE_RUN_SYNC_STATE,
                pendingRunsForSync
              });
              if (eventEligibleStatus >= 400) {
                return new Response(eventEligibleStatus, null);
              }
              return new Response(200, null);
            }
          });
        }
      }).catch(err => {
        return new Response(500, null);
      });
  }
};

//Private method to Update Sync Flag for Runs in Local DB
const updateSyncStateInDB = (pendingRunsForSync) => {
  return async dispatch => {
    try {
      let pendingRunIds = "";
      pendingRunsForSync.map(pendingRun => {
        pendingRunIds = pendingRunIds + pendingRun.runId + ",";
      });
      pendingRunIds = pendingRunIds.replace(/(^[,\s]+)|([,\s]+$)/g, '');
      return updateRunsSyncState(pendingRunIds).then((response) => {
        return new Response(200, pendingRunsForSync);
      });
    } catch (err) {
      return new Response(500, null);
    }
  }
};

//Private method to Update Event Id for Run in Local DB
const updateEventIdInDB = (runDetails, eventId) => {
  return async dispatch => {
    try {
      return updateEventIdInRunDetails(runDetails.runId.toString(), eventId).then((response) => {
        return new Response(200, runDetails);
      });
    } catch (err) {
      return new Response(500, null);
    }
  }
};

//Private Utility Method to Check and Delete Synced Runs from Local Database
const checkAndDeleteRunsIfNeeded = () => {
  return async dispatch => {
    return fetchRuns().then((response) => {
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
          return deleteRuns(runIdsToBeDeleted).then((response) => {
            return new Response(200, response);
          }).catch(err => {
            return new Response(500, null);
          });
        }
      }
    }).catch(err => {
      return new Response(500, null);
    });
  };
};

//Private Method to Check whether current run is eligible for Event Submission based on Event Metric Value
const validateIfRunEligibleForEventSubmission = (runDetails) => {
  return async dispatch => {
    try {
      return fetchEventDetailsBasedOnEventId(runDetails.eventId).then((response) => {
        var currentTime = new Date().getTime();
        var eventEndDateTime = new Date(response.rows._array[0].EVENT_END_DATE);
        var eventMetricValue = response.rows._array[0].EVENT_METRIC_VALUE;

        if (parseFloat(runDetails.runDistance / 1000) < parseFloat(eventMetricValue)) {
          return new Response(453, null);
        } else if (currentTime > eventEndDateTime) {
          return new Response(454, null);
        }
        return new Response(200, null);
      });
    } catch (err) {
      return new Response(500, null);
    }
  };
};