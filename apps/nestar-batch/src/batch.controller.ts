import { Controller, Get, Logger } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { BATCH_ROLLBACK, BATCH_TOP_AGENTS, BATCH_TOP_PROPERTIES } from './lib/config';

@Controller()
export class BatchController {
   
   private logger: Logger = new Logger('batchController');
  constructor(private readonly batchService: BatchService) {}



@Timeout(3000)
handleTimeOut(){
  this.logger.debug('BATCH SERVER READY')
}

@Cron('40 * * * * *', {name: BATCH_ROLLBACK})
public async batchRollBack(){
  try{
   this.logger['context'] =BATCH_ROLLBACK
   this.logger.debug("EXECUTED")
   await this.batchService.batchRollBack()
}catch(err){
  this.logger.error(err)
}}

@Cron('45 * * * * *', {name: BATCH_TOP_PROPERTIES})
public async batchTopProperties(){
  try{
   this.logger['context'] = BATCH_TOP_PROPERTIES
   this.logger.debug("EXECUTED")
   await this.batchService.batchTopProperties()
}catch(err){
  this.logger.error(err)
}}


@Cron('50 * * * * *', {name: BATCH_TOP_AGENTS})
public async batchTopAgents(){
  try{
   this.logger['context'] =BATCH_TOP_AGENTS
   this.logger.debug("EXECUTED")
   await this.batchService.batchTopAgents()
}catch(err){
  this.logger.error(err)
}}
/*
@Interval(1000)
  handleInterval(){
  this.logger.debug("** Interval server **")
}
  */


  @Get()
  getHello(): string {
    return this.batchService.getHello();
  }
}
