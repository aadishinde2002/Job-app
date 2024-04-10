import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Database } from '@nozbe/watermelondb';
import Profiledb from './profiledb'; 
import { mySchema } from './Schema';
import migrations from './migrations'

const adapter = new SQLiteAdapter({
    schema: mySchema,
    migrations,
});

export const database = new Database({
    adapter,
    modelClasses: [Profiledb], 
    actionEnabled: true, 
});


// export const initializeDatabase = async () => {
//     try {
//       await database.adapter.initialize(); // Initialize the adapter (create tables if needed)
//       console.log('Database initialized successfully');
//     } catch (error) {
//       console.log('Error initializing database:', error);
//     }
//   };