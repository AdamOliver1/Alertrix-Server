import { Location, ThresholdCondition } from './weather';

export interface Alert {
  id: string;
  name: string;
  description?: string;
  emails: string[];
  location: Location;
  condition: ThresholdCondition;
  isTriggered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertStatus {
  id: string;
  name: string;
  isTriggered: boolean;
  condition: ThresholdCondition;
  location: Location;
  emails: string[];
}

export interface AlertDto {
  name: string;
  description?: string;
  emails: string[];
  location: Location;
  condition: ThresholdCondition;
} 