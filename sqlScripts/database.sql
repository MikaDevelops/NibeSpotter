CREATE DATABASE NibeSpotterDB COLLATE 'latin1_swedish_ci';

USE NibeSpotterDB;

CREATE TABLE spotPrice
(
  startTime DATETIME NOT NULL,
  endTime DATETIME NOT NULL,
  price FLOAT NOT NULL,
  priceArea VARCHAR(50) NOT NULL,
  PRIMARY KEY (startTime)
);

CREATE TABLE location
(
  longtitude FLOAT NOT NULL,
  latitude FLOAT NOT NULL,
  name VARCHAR(80) NOT NULL,
  id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id)
);

CREATE TABLE nibeSystem
(
  id INT NOT NULL AUTO_INCREMENT,
  productName VARCHAR(80) NOT NULL,
  serialNumber VARCHAR(80) NOT NULL,
  nibeStatusID INT NOT NULL,
  locationID INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (locationID) REFERENCES location(id)
);

CREATE TABLE nibeStatus
(
  time DATETIME NOT NULL,
  roomTemperatureC FLOAT NOT NULL,
  outdoorTemperatureC FLOAT NOT NULL,
  id INT NOT NULL AUTO_INCREMENT,
  hotWaterTemperatureC FLOAT NOT NULL,
  airFanSpeed INT NOT NULL,
  nibeSystemID INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (nibeSystemID) REFERENCES nibeSystem(id)
);

CREATE TABLE settingHistory
(
  time DATETIME NOT NULL,
  id INT NOT NULL AUTO_INCREMENT,
  roomTargetTempC FLOAT NOT NULL,
  ventilationBoost BOOLEAN NOT NULL,
  nibeSystemID INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (nibeSystemID) REFERENCES nibeSystem(id)
);

CREATE TABLE weatherInfo
(
  time DATETIME NOT NULL,
  temperatureC FLOAT NOT NULL,
  id INT NOT NULL AUTO_INCREMENT,
  serviceName VARCHAR(80) NOT NULL,
  locationID INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (locationID) REFERENCES location(id)
);