
export const dbInfo  = {
  host: process.env['POSTGRES_HOST'] || 'localhost',
  port: process.env['POSTGRES_PORT'] ? parseInt(process.env['POSTGRES_PORT']) : 5432,
  database: process.env['POSTGRES_DB'] || 'tododb',
  user: process.env['POSTGRES_USER'] || 'postgres',
  password: process.env['POSTGRES_PASSWORD'] || 'postgres',
}

export const dbConnectionString = `postgresql://${dbInfo.user}:${dbInfo.password}@${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`;