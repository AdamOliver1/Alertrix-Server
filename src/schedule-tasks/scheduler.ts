import cron from 'node-cron';
import { container } from '../app-registry/container';
import { IAlertService } from '../services/interfaces/alert.service.interface';
import { logger } from '../utils/logger';

// Default schedule is every 10 minutes
const DEFAULT_SCHEDULE = '*/10 * * * *';

export class Scheduler {
  private schedule: string;
  private task: cron.ScheduledTask | null = null;

  constructor(schedule: string = DEFAULT_SCHEDULE) {
    this.schedule = schedule;
  }

  start(): void {
    if (this.task) {
      logger.warn('Scheduler is already running');
      return;
    }

    logger.info(`Starting alert evaluation scheduler with schedule: ${this.schedule}`);
    
    this.task = cron.schedule(this.schedule, async () => {
      try {
        const alertService = container.resolve<IAlertService>('IAlertService');
        await alertService.evaluateAllAlerts();
      } catch (error) {
        logger.error('Error in scheduled alert evaluation', { error });
      }
    });
  }

  stop(): void {
    if (!this.task) {
      logger.warn('Scheduler is not running');
      return;
    }

    logger.info('Stopping alert evaluation scheduler');
    this.task.stop();
    this.task = null;
  }
} 