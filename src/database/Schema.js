import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'profiledata',
      columns: [
        { name: 'name', type: 'string', isOptional:true },
        { name: 'lname', type: 'string', isOptional:true  },
        { name: 'email', type: 'string', isOptional:true  },
        { name: 'profile', type: 'string', isOptional:true  },
      ]
    })
  ]
})