import * as SQLite from 'expo-sqlite';

const db=SQLite.openDatabase('onehealth.db');

export const init=()=>{ 
const promise=new Promise((resolve, reject)=>{ 
db.transaction((tx)=>{ 
    tx.executeSql('CREATE TABLE IF NOT EXISTS RUN_DETAILS (RUN_ID INTEGER PRIMARY KEY NOT NULL, RUN_TOTAL_TIME TEXT NOT NULL, RUN_DISTANCE TEXT NOT NULL,RUN_PACE TEXT NOT NULL,RUN_CALORIES_BURNT TEXT NOT NULL,RUN_CREDITS TEXT NOT NULL, RUN_DATE TEXT NOT NULL, RUN_DAY TEXT NOT NULL, RUN_PATH TEXT NOT NULL, RUN_TRACK_SNAP_URL TEXT NOT NULL);',
    //tx.executeSql('DROP TABLE RUN_DETAILS;',
        [], 
        ()=>{ 
          resolve(); 
        },
        (_,err)=>{ 
         reject(err); 
        }); 

    tx.executeSql('CREATE TABLE IF NOT EXISTS RUN_SUMMARY (id INTEGER PRIMARY KEY NOT NULL, TOTAL_DISTANCE TEXT NOT NULL, TOTAL_RUNS TEXT NOT NULL,AVERAGE_PACE TEXT NOT NULL,AVERAGE_DISTANCE TEXT NOT NULL);',
    //tx.executeSql('DROP TABLE RUN_SUMMARY;',
     [], 
        ()=>{ 
          resolve(); 
        },
        (_,err)=>{ 
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

export const insertRun=(runTotalTime,runDistance,runPace,runCaloriesBurnt,runCredits,runDate,runDay,runPath,runTrackSnapUrl)=>{
	const promise=new Promise((resolve, reject)=>{
db.transaction((tx)=>{
	tx.executeSql('INSERT INTO RUN_DETAILS (RUN_TOTAL_TIME,RUN_DISTANCE,RUN_PACE,RUN_CALORIES_BURNT,RUN_CREDITS, RUN_DATE, RUN_DAY, RUN_PATH, RUN_TRACK_SNAP_URL) VALUES (?,?,?,?,?,?,?,?,?);',
		[runTotalTime,runDistance,runPace,runCaloriesBurnt,runCredits,runDate,runDay,runPath,runTrackSnapUrl],
		(_,result)=>{
          resolve(result);
		},
		(_,err)=>{
         reject(err);
		});
});
});
return promise;
};

export const fetchRuns=()=>{
const promise=new Promise((resolve, reject)=>{
db.transaction((tx)=>{
	tx.executeSql('SELECT * FROM RUN_DETAILS',
		[],
		(_,result)=>{
          resolve(result);
		},
		(_,err)=>{
         reject(err);
		});
});
});
return promise;
};

export const insertRunSummary=(totalDistance,totalRuns,averagePace,averageDistance)=>{
	const promise=new Promise((resolve, reject)=>{
db.transaction((tx)=>{
	tx.executeSql('INSERT INTO RUN_SUMMARY (TOTAL_DISTANCE,TOTAL_RUNS,AVERAGE_PACE,AVERAGE_DISTANCE) VALUES (?,?,?,?);',
		[totalDistance,totalRuns,averagePace,averageDistance],
		(_,result)=>{
          resolve(result);
		},
		(_,err)=>{
         reject(err);
		});
});
});
return promise;
};

export const updateRunSummary=(totalDistance,totalRuns,averagePace,averageDistance)=>{
	const promise=new Promise((resolve, reject)=>{
db.transaction((tx)=>{
	tx.executeSql('UPDATE RUN_SUMMARY SET TOTAL_DISTANCE=?,TOTAL_RUNS=?,AVERAGE_PACE=?,AVERAGE_DISTANCE=?;',
		[totalDistance,totalRuns,averagePace,averageDistance],
		(_,result)=>{
          resolve(result);
		},
		(_,err)=>{
         reject(err);
		});
});
});
return promise;
};

export const fetchRunSummary=()=>{
const promise=new Promise((resolve, reject)=>{
db.transaction((tx)=>{
	tx.executeSql('SELECT * FROM RUN_SUMMARY',
		[],
		(_,result)=>{
          resolve(result);
		},
		(_,err)=>{
         reject(err);
		});
});
});
return promise;
};