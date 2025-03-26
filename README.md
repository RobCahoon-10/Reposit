# Reposit

## Description

This project is built using TypeScript and Node.js. The structure of the project is as follows:

- **data**: Contains CSV files that provide necessary data.
- **src**: Contains multiple function folders, along with `utils` and `types` directories.

## Getting started

- Clone the repository

```
git clone https://github.com/RobCahoon-10/Reposit.git
```

- Install dependencies

```
cd <project_name>
npm install
```

- Build and run the project. This will run the src/index.ts file which is running all the functions with default values

```
npm start
```

## How to Test

I have added a couple of ways to test:

`ts-node src` - this will run the index.ts file which contains a try catch which will run all the functions with some default params

`npm test` - will run all the unit tests

You can also test indivdually in the command line, for example:

```
ts-node src/calculate-average-rent wales
ts-node src/calculate-monthly-rent-per-tenant p_1008 pounds
ts-node src/find-invalid-postcodes
ts-node src/get-property-status p_1080
```

## Packages

`csv-parse` - A parser for CSV files.

`sinon` - A library for creating spies, stubs, and mocks for JavaScript.

`tsx` - A library for running TypeScript files directly.

`proxyquire` - A module for overriding dependencies during testing.

`ts-node` - A TypeScript execution environment for Node.js.

`typescript`- The TypeScript language.
