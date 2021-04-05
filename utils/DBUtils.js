import * as SQLite from 'expo-sqlite';
import ExceptionDetails from '../models/exceptionDetails';
import * as loggingActions from '../store/logging-actions';

const db = SQLite.openDatabase('fitlers.db');

//Method to initialize the tables for first time usage
export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS RUN_DETAILS (RUN_ID INTEGER PRIMARY KEY NOT NULL, RUN_TOTAL_TIME TEXT NOT NULL, RUN_DISTANCE TEXT NOT NULL,RUN_PACE TEXT NOT NULL,RUN_CALORIES_BURNT TEXT NOT NULL,RUN_CREDITS TEXT NOT NULL,RUN_START_DATE_TIME TEXT NOT NULL ,RUN_DATE TEXT NOT NULL, RUN_DAY TEXT NOT NULL, RUN_PATH TEXT NOT NULL, RUN_TRACK_SNAP_URL TEXT NOT NULL,EVENT_ID INTEGER,IS_SYNC_DONE TEXT NOT NULL);',
        //tx.executeSql('DROP TABLE RUN_DETAILS;',
        [],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        });

      tx.executeSql('CREATE TABLE IF NOT EXISTS RUN_SUMMARY (id INTEGER PRIMARY KEY NOT NULL, TOTAL_DISTANCE TEXT NOT NULL, TOTAL_RUNS TEXT NOT NULL,TOTAL_CREDITS TEXT NOT NULL, AVERAGE_PACE TEXT NOT NULL,AVERAGE_DISTANCE TEXT NOT NULL, AVERAGE_CALORIES_BURNT TEXT NOT NULL);',
        //tx.executeSql('DROP TABLE RUN_SUMMARY;',
        [],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        });

        tx.executeSql('CREATE TABLE IF NOT EXISTS EVENT_REGISTRATION_DETAILS (EVENT_ID INTEGER PRIMARY KEY NOT NULL, EVENT_NAME TEXT NOT NULL, EVENT_DESCRIPTION TEXT,EVENT_START_DATE TEXT NOT NULL,EVENT_END_DATE TEXT NOT NULL, EVENT_METRIC_TYPE TEXT NOT NULL, EVENT_METRIC_VALUE TEXT NOT NULL, RUN_ID INTEGER);',
        //tx.executeSql('DROP TABLE EVENT_REGISTRATION_DETAILS;',
        //tx.executeSql('DELETE FROM EVENT_REGISTRATION_DETAILS;',
        [],
        () => {
          resolve();
        },
        (_, err) => {
          dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
          reject(err);
        });
    });
  });
  return promise;
};

//Method to Insert New Run in RUN_DETAILS
export const insertRun = (runId, runTotalTime, runDistance, runPace, runCaloriesBurnt, runCredits, runStartDateTime, runDate, runDay, runPath, runTrackSnapUrl, eventId, isSyncDone) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO RUN_DETAILS (RUN_ID,RUN_TOTAL_TIME,RUN_DISTANCE,RUN_PACE,RUN_CALORIES_BURNT,RUN_CREDITS,RUN_START_DATE_TIME ,RUN_DATE, RUN_DAY, RUN_PATH, RUN_TRACK_SNAP_URL,EVENT_ID,IS_SYNC_DONE) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);', [runId, runTotalTime, runDistance, runPace, runCaloriesBurnt, runCredits, runStartDateTime, runDate, runDay, runPath, runTrackSnapUrl, eventId, isSyncDone],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
          reject(err);
        });
    });
  });
  return promise;
};

//Method to Delete Runs from RUN_DETAILS based on runIds
export const deleteRuns = (runIds) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM RUN_DETAILS where RUN_ID in (' + runIds + ');', [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
          reject(err);
        });
    });
  });
  return promise;
};

//Method to fetch runs from RUN_DETAILS
export const fetchRuns = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM RUN_DETAILS', [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
          reject(err);
        });
    });
  });
  return promise;
};

//Method to return Runs from RUN_DETAILS that are not updated to server
export const fetchRunsToSync = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM RUN_DETAILS where IS_SYNC_DONE="0"', [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
          reject(err);
        });
    });
  });
  return promise;
};

//Method to Update Runs Sync Flag in RUN_DETAILS
export const updateRunsSyncState = (pendingRunsForSync) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('UPDATE RUN_DETAILS SET IS_SYNC_DONE="1" where RUN_ID in (' + pendingRunsForSync + ');', [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
          reject(err);
        });
    });
  });
  return promise;
};

//Method to Insert Run Summary In RUN_SUMMARY
export const insertRunSummary = (totalDistance, totalRuns, totalCredits, averagePace, averageDistance, averageCaloriesBurnt) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO RUN_SUMMARY (TOTAL_DISTANCE,TOTAL_RUNS,TOTAL_CREDITS,AVERAGE_PACE,AVERAGE_DISTANCE,AVERAGE_CALORIES_BURNT) VALUES (?,?,?,?,?,?);', [totalDistance, totalRuns, totalCredits, averagePace, averageDistance, averageCaloriesBurnt],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
          reject(err);
        });
    });
  });
  return promise;
};

//Method to Update Event Id In RUN_DETAILS
export const updateEventIdInRunDetails = (runId, eventId) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('UPDATE RUN_DETAILS SET EVENT_ID=? where RUN_ID in (' + runId + ');', [eventId],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
          reject(err);
        });
    });
  });
  return promise;
};

//Method to Update Run Summary in RUN_SUMMARY
export const updateRunSummary = (totalDistance, totalRuns, totalCredits, averagePace, averageDistance, averageCaloriesBurnt) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('UPDATE RUN_SUMMARY SET TOTAL_DISTANCE=?,TOTAL_RUNS=?,TOTAL_CREDITS=?,AVERAGE_PACE=?,AVERAGE_DISTANCE=?,AVERAGE_CALORIES_BURNT=?', [totalDistance, totalRuns, totalCredits, averagePace, averageDistance, averageCaloriesBurnt],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
          reject(err);
        });
    });
  });
  return promise;
};

//Method to fetch Run Summary from RUN_SUMMARY
export const fetchRunSummary = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM RUN_SUMMARY;', [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
          reject(err);
        });
    });
  });
  return promise;
};

//Method to Insert Event Registration Details in EVENT_REGISTRATION_DETAILS
export const insertEventRegistrationDetails = (eventId, eventName, eventDescription, eventStartDate, eventEndDate, eventMetricType, eventMetricValue, runId) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO EVENT_REGISTRATION_DETAILS (EVENT_ID,EVENT_NAME,EVENT_DESCRIPTION,EVENT_START_DATE,EVENT_END_DATE,EVENT_METRIC_TYPE,EVENT_METRIC_VALUE,RUN_ID) VALUES (?,?,?,?,?,?,?,?);', [eventId, eventName, eventDescription, eventStartDate, eventEndDate, eventMetricType, eventMetricValue, runId],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
          reject(err);
        });
    });
  });
  return promise;
};

//Method to Update Event Registration Details in EVENT_REGISTRATION_DETAILS
export const updateEventRegistrationDetails = (eventId, runId) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('UPDATE EVENT_REGISTRATION_DETAILS SET RUN_ID=? where EVENT_ID in (' + eventId + ');', [runId],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
          reject(err);
        });
    });
  });
  return promise;
};

//Method to Get Event Registration Details from EVENT_REGISTRATION_DETAILS
export const fetchEventRegistrationDetails = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM EVENT_REGISTRATION_DETAILS', [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
          reject(err);
        });
    });
  });
  return promise;
};

//Method to Get Event Registration Details from EVENT_REGISTRATION_DETAILS based on eventId
export const fetchEventDetailsBasedOnEventId = (eventId) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM EVENT_REGISTRATION_DETAILS where EVENT_ID in (' + eventId + ');', [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
          reject(err);
        });
    });
  });
  return promise;
};

//Method to Clean Up All Local Data
export const cleanUpAllData = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM RUN_DETAILS;', [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
          reject(err);
        });
      tx.executeSql('DELETE FROM RUN_SUMMARY;', [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
          reject(err);
        });
      tx.executeSql('DELETE FROM EVENT_REGISTRATION_DETAILS;', [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          dispatch(loggingActions.sendErrorLogsToServer(new ExceptionDetails(err.message, err.stack)));
          reject(err);
        });
    });
  });
  return promise;
};