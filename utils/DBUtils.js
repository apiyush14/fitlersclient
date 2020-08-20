import * as SQLite from 'expo-sqlite';

const db=SQLite.openDatabase('onehealth.db');

export const init=()=>{ 
const promise=new Promise((resolve, reject)=>{ 
db.transaction((tx)=>{ 
    tx.executeSql('CREATE TABLE IF NOT EXISTS RUN_DETAILS (id INTEGER PRIMARY KEY NOT NULL, track_image TEXT NOT NULL, date TEXT NOT NULL,day TEXT NOT NULL,lapsedTime TEXT NOT NULL,totalDistance TEXT NOT NULL);',
    //tx.executeSql('DROP TABLE RUN_DETAILS;', 
        [], 
        ()=>{ 
          resolve(); 
        },
        (_,err)=>{ 
         reject(err); 
        }); 
}); 
}); 
return promise; 
};

export const insertRun=(track_image, date, day, lapsedTime, totalDistance)=>{
	const promise=new Promise((resolve, reject)=>{
db.transaction((tx)=>{
	tx.executeSql('INSERT INTO RUN_DETAILS (track_image,date,day,lapsedTime,totalDistance) VALUES (?,?,?,?,?);',
		[track_image,date,day,lapsedTime,totalDistance],
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