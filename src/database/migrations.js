import { createTable, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
  migrations: [
    {
        // ⚠️ Set this to a number one larger than the current schema version
        toVersion: 2,
        steps: [
          // See "Migrations API" for more details
          createTable({
            name: 'profiledata',
            columns: [
                { name: 'name', type: 'string', isOptional:true },
                { name: 'lname', type: 'string', isOptional:true  },
                { name: 'email', type: 'string', isOptional:true  },
                { name: 'profile', type: 'string', isOptional:true  },
            ],
          }),
        ],
      },
  ],
})