import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('onehealth.db');

export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS RUN_DETAILS (RUN_ID INTEGER PRIMARY KEY NOT NULL, RUN_TOTAL_TIME TEXT NOT NULL, RUN_DISTANCE TEXT NOT NULL,RUN_PACE TEXT NOT NULL,RUN_CALORIES_BURNT TEXT NOT NULL,RUN_CREDITS TEXT NOT NULL,RUN_START_DATE_TIME TEXT NOT NULL ,RUN_DATE TEXT NOT NULL, RUN_DAY TEXT NOT NULL, RUN_PATH TEXT NOT NULL, RUN_TRACK_SNAP_URL TEXT NOT NULL,IS_SYNC_DONE TEXT NOT NULL);',
        //tx.executeSql('DROP TABLE RUN_DETAILS;',
        [],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        });

      tx.executeSql('CREATE TABLE IF NOT EXISTS RUN_SUMMARY (id INTEGER PRIMARY KEY NOT NULL, TOTAL_DISTANCE TEXT NOT NULL, TOTAL_RUNS TEXT NOT NULL,AVERAGE_PACE TEXT NOT NULL,AVERAGE_DISTANCE TEXT NOT NULL);',
        //tx.executeSql('DROP TABLE RUN_SUMMARY;',
        [],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        });

      tx.executeSql('CREATE TABLE IF NOT EXISTS USER_AUTHENTICATION_DETAILS (id INTEGER PRIMARY KEY NOT NULL, USER_ID TEXT NOT NULL, USER_SECRET_KEY TEXT NOT NULL);',
        //tx.executeSql('DROP TABLE USER_AUTHENTICATION_DETAILS;',
        [],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        });

        //tx.executeSql('CREATE TABLE IF NOT EXISTS EVENT_REGISTRATION_DETAILS (EVENT_ID INTEGER PRIMARY KEY NOT NULL, EVENT_NAME TEXT NOT NULL, EVENT_DESCRIPTION TEXT,EVENT_START_DATE TEXT NOT NULL,EVENT_END_DATE TEXT NOT NULL);',
        //tx.executeSql('DROP TABLE EVENT_REGISTRATION_DETAILS;',
        tx.executeSql('DELETE FROM EVENT_REGISTRATION_DETAILS;',
        [],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        });

      /*tx.executeSql('INSERT INTO RUN_SUMMARY (total_distance,total_runs,average_pace,average_distance) VALUES (?,?,?,?);',
         ["0","0","0","0"], 
          ()=>{ 
            resolve(); 
          },
          (_,err)=>{ 
           reject(err); 
          }); */
    });
  });
  return promise;
};

export const insertRun = (runId, runTotalTime, runDistance, runPace, runCaloriesBurnt, runCredits, runStartDateTime, runDate, runDay, runPath, runTrackSnapUrl, isSyncDone) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO RUN_DETAILS (RUN_ID,RUN_TOTAL_TIME,RUN_DISTANCE,RUN_PACE,RUN_CALORIES_BURNT,RUN_CREDITS,RUN_START_DATE_TIME ,RUN_DATE, RUN_DAY, RUN_PATH, RUN_TRACK_SNAP_URL,IS_SYNC_DONE) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);', [runId, runTotalTime, runDistance, runPace, runCaloriesBurnt, runCredits, runStartDateTime, runDate, runDay, runPath, runTrackSnapUrl, isSyncDone],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          console.log('Insertion Run Failed');
          reject(err);
        });
    });
  });
  return promise;
};

export const deleteRuns = (runIds) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM RUN_DETAILS where RUN_ID in (' + runIds + ');', [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        });
    });
  });
  return promise;
};

export const fetchRuns = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM RUN_DETAILS', [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        });
    });
  });
  return promise;
};

export const fetchRunsToSync = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM RUN_DETAILS where IS_SYNC_DONE="0"', [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        });
    });
  });
  return promise;
};

export const updateRunsSyncState = (pendingRunsForSync) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('UPDATE RUN_DETAILS SET IS_SYNC_DONE="1" where RUN_ID in (' + pendingRunsForSync + ');', [pendingRunsForSync],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        });
    });
  });
  return promise;
};

export const insertRunSummary = (totalDistance, totalRuns, averagePace, averageDistance) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO RUN_SUMMARY (TOTAL_DISTANCE,TOTAL_RUNS,AVERAGE_PACE,AVERAGE_DISTANCE) VALUES (?,?,?,?);', [totalDistance, totalRuns, averagePace, averageDistance],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        });
    });
  });
  return promise;
};

export const updateRunSummary = (totalDistance, totalRuns, averagePace, averageDistance) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('UPDATE RUN_SUMMARY SET TOTAL_DISTANCE=?,TOTAL_RUNS=?,AVERAGE_PACE=?,AVERAGE_DISTANCE=?', [totalDistance, totalRuns, averagePace, averageDistance],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        });
    });
  });
  return promise;
};

export const fetchRunSummary = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM RUN_SUMMARY;', [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        });
    });
  });
  return promise;
};

export const insertUser = (userId, userSecretKey) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO USER_AUTHENTICATION_DETAILS (USER_ID,USER_SECRET_KEY) VALUES (?,?)', [userId, userSecretKey],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        });
    });
  });
  return promise;
};

export const updateUser = (userId, userSecretKey) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('UPDATE USER_AUTHENTICATION_DETAILS SET USER_ID=?,USER_SECRET_KEY=?', [userId, userSecretKey],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        });
    });
  });
  return promise;
};

export const fetchUserAuthenticationDetails = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM USER_AUTHENTICATION_DETAILS;', [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        });
    });
  });
  return promise;
};

export const insertEventRegistrationDetails = (eventId, eventName, eventDescription, eventStartDate, eventEndDate) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO EVENT_REGISTRATION_DETAILS (EVENT_ID,EVENT_NAME,EVENT_DESCRIPTION,EVENT_START_DATE,EVENT_END_DATE) VALUES (?,?,?,?,?);', [eventId, eventName, eventDescription, eventStartDate, eventEndDate],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        });
    });
  });
  return promise;
};

export const fetchEventRegistrationDetails = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM EVENT_REGISTRATION_DETAILS', [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        });
    });
  });
  return promise;
};