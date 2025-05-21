import { Injectable } from '@angular/core';
import * as moment from 'moment';
//declare var moment: any;

@Injectable()
export class TimeZoneService {

  public constructor() { }

  public static getRangeBaseTimeDisplay(datetime: any, isUTC: boolean){
    let today = new Date();
    let actualDate = new Date(datetime);
    if (isUTC) {
      var localOffset = actualDate.getTimezoneOffset() * 60000;
      var localTime = actualDate.getTime();
      actualDate = new Date(actualDate.getTime() - localOffset);
    }
    let timeDiff = this.DateDiff(today, actualDate);
    let localDateTime: any;
    if (timeDiff == 0)
      localDateTime = moment(actualDate).format('LT');
    else if(timeDiff > 0 && timeDiff <= 7)
      localDateTime = moment(actualDate).format('ddd MM/DD');
    else if(timeDiff > 7 )
      localDateTime = moment(actualDate).format('L'); 
    return localDateTime

  }
  public static ConvertToDateFormat(datetime: any, isUTC: boolean){
    let today = new Date();

    let actualDate = new Date(datetime);
    if (isUTC) {
      var localOffset = actualDate.getTimezoneOffset() * 60000;
      var localTime = actualDate.getTime();
      actualDate = new Date(actualDate.getTime() - localOffset);
    }

    let timeDiff = this.dateCompare(today, actualDate);
    let localDateTime: any;
    localDateTime = moment(actualDate).format('ddd MM/DD');
    return localDateTime
  }
  public static getLocalDateTimeShort(datetime: any, isUTC: boolean) {

    let today = new Date();

    let actualDate = new Date(datetime);
    if (isUTC) {
      var localOffset = actualDate.getTimezoneOffset() * 60000;
      var localTime = actualDate.getTime();
      actualDate = new Date(actualDate.getTime() - localOffset);
    }

    let timeDiff = this.dateCompare(today, actualDate);
    let localDateTime: any;
    if (timeDiff == 0)
      localDateTime = moment(actualDate).format('LT');
    else
      localDateTime = moment(actualDate).format('ll');
    return localDateTime
  }

  public static getLocalDateTime(datetime: any, isUTC: boolean) {

    let today = new Date();

    let actualDate = new Date(datetime);
    if (isUTC) {
      var localOffset = actualDate.getTimezoneOffset() * 60000;
      var localTime = actualDate.getTime();
      actualDate = new Date(actualDate.getTime() - localOffset);
    }

    let timeDiff = this.dateCompare(today, actualDate);
    let localDateTime: any;
    if (timeDiff == 0)
      localDateTime = moment(actualDate).calendar();
    else
      localDateTime = moment(actualDate).format('lll');
    return localDateTime
  }

  public static getLocalDateTimeWithDay(datetime: any, isUTC: boolean) {

    let today = new Date();

    let actualDate = new Date(datetime);
    if (isUTC) {
      var localOffset = actualDate.getTimezoneOffset() * 60000;
      var localTime = actualDate.getTime();
      actualDate = new Date(actualDate.getTime() - localOffset);
    }

    let timeDiff = this.dateCompare(today, actualDate);
    let localDateTime: any;
    if (timeDiff == 0)
      localDateTime = moment(actualDate).calendar();
    else
      localDateTime = moment(actualDate).format('llll');
    return localDateTime
  }

  public static dateCompare(dateTimeA, dateTimeB) {
    var momentA = moment(dateTimeA, "MM/DD/YYYY").format('L')
    var momentB = moment(dateTimeB, "MM/DD/YYYY").format('L')
    if (momentA > momentB) return 1;
    else if (momentA < momentB) return -1;
    else return 0;
  }
  public static DateDiff(dateTimeA, dateTimeB){
    var momentA = moment(dateTimeA, "MM/DD/YYYY").format('L')
    var momentB = moment(dateTimeB, "MM/DD/YYYY").format('L')
    let date1:any;  let date2:any;
    date1 = new Date(momentA);
    date2 = new Date(momentB);
    let diffTime:number; let diffDays:number;
    diffTime = Math.abs(date2 - date1);
    diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  }
  public static getLocalCurrentTime() {

    let today = new Date();
    let localDateTime: any;
    localDateTime = moment(today).format('LT');
    return localDateTime
  }

  public static getLocalTime(datetime: any, isUTC: boolean) {

    let today = new Date();

    let actualDate = new Date(datetime);
    if (isUTC) {
      var localOffset = actualDate.getTimezoneOffset() * 60000;
      var localTime = actualDate.getTime();
      actualDate = new Date(actualDate.getTime() - localOffset);
    }

    let timeDiff = this.dateCompare(today, actualDate);
    let localDateTime: any;
    localDateTime = moment(actualDate).format('LT');
    return localDateTime
  }

  public static getRelativeTime(datetime: any, isUTC: boolean) {
    let today = new Date();
    let actualDate = new Date(datetime);
    if (isUTC) {
      var localOffset = actualDate.getTimezoneOffset() * 60000;
      var localTime = actualDate.getTime();
      actualDate = new Date(actualDate.getTime() - localOffset);
    }
    let timeDiff = this.dateCompare(today, actualDate);
    let localDateTime: any;
    if (timeDiff == 0)
      localDateTime = moment(actualDate).calendar();
    else if (timeDiff == 1)
      localDateTime = moment(actualDate).startOf('day').fromNow();
    return localDateTime
  }

  public static getLocalDateTimeForInterviewDate(datetime: any, isUTC: boolean) {

    let today = new Date();

    let actualDate = new Date(datetime);
    if (isUTC) {
      var localOffset = actualDate.getTimezoneOffset() * 60000;
      var localTime = actualDate.getTime();
      actualDate = new Date(actualDate.getTime() - localOffset);
    }

    let timeDiff = this.dateCompare(today, actualDate);
    let localDateTime: any;
    if (timeDiff == 0)
      localDateTime = moment(actualDate).calendar();
    else if (timeDiff == 1 || -1)
      localDateTime = moment(actualDate).format('lll');

    return localDateTime
  }
  public static getFormattedDateTime(datetime: any) {

    let actualDate = new Date(datetime);

    let formattedDateTime: any;
    formattedDateTime = moment(actualDate).format('lll');
    return formattedDateTime
  }

  public static getLocalDateOnly(datetime: any, isUTC: boolean) {

    let today = new Date();

    let actualDate = new Date(datetime);
    if (isUTC) {
      var localOffset = actualDate.getTimezoneOffset() * 60000;
      var localTime = actualDate.getTime();
      actualDate = new Date(actualDate.getTime() - localOffset);
    }

    let timeDiff = this.dateCompare(today, actualDate);
    let localDateTime: any;
    localDateTime = moment(actualDate).format('ll');
    return localDateTime
  }

  public static getFormattedDateOnly(datetime: any) {

    let actualDate = new Date(datetime);

    let formattedDateTime: any;
    formattedDateTime = moment(actualDate).format('ll');
    return formattedDateTime
  }
  public static getShortDateOnly(date: string) {
    let tempDate = date.substring(0, date.indexOf('T'))
    return tempDate;
  }

  public static getLocalDateTime_Timestamp(datetime:any,isUTC:boolean){ 
      
    let today=new Date();
    
    let actualDate=new Date(datetime);
    if(isUTC){
      var localOffset = actualDate.getTimezoneOffset() * 60000;
      var localTime = actualDate.getTime();
      actualDate = new Date(actualDate.getTime() - localOffset);
    }

    let timeDiff =this.dateCompare(today,actualDate);
    let localDateTime:any;
    localDateTime=moment(actualDate).format("MM/DD/YYYY HH:mm"); 
    // if(timeDiff==0)
    //   localDateTime=moment(actualDate).calendar();
    // else 
    //   localDateTime=moment(actualDate).format("MM/DD/YYYY hh:mm A");  
    return localDateTime
  }
  public static getLocalDateTime_Date(datetime:any,isUTC:boolean){ 
      
    let today=new Date();
    
    let actualDate=new Date(datetime);
    if(isUTC){
      var localOffset = actualDate.getTimezoneOffset() * 60000;
      var localTime = actualDate.getTime();
      actualDate = new Date(actualDate.getTime() - localOffset);
    }

    let timeDiff =this.dateCompare(today,actualDate);
    let localDateTime:any;
    localDateTime=moment(actualDate).format("MM/DD/YYYY"); 
    // if(timeDiff==0)
    //   localDateTime=moment(actualDate).calendar();
    // else 
    //   localDateTime=moment(actualDate).format("MM/DD/YYYY hh:mm A");  
    return localDateTime
  }
  public static getTimeFromNow(datetime: any, isUTC: boolean) {

    let today = new Date();

    let actualDate = new Date(datetime);
    if (isUTC) {
      var localOffset = actualDate.getTimezoneOffset() * 60000;
      var localTime = actualDate.getTime();
      actualDate = new Date(actualDate.getTime() - localOffset);
    }

    let timeDiff = this.dateCompare(today, actualDate);
    let localDateTime: any;
    if (timeDiff == 0)
      localDateTime = moment(actualDate).fromNow();
    else
      localDateTime = moment(actualDate).fromNow();//moment(actualDate).format('ll');
    return localDateTime
  }

  public static getLocalDateTime_Submission(datetime: any, isUTC: boolean) {

    let today = new Date();

    let actualDate = new Date(datetime);
    if (isUTC) {
      var localOffset = actualDate.getTimezoneOffset() * 60000;
      var localTime = actualDate.getTime();
      actualDate = new Date(actualDate.getTime() - localOffset);
    }

    let timeDiff = this.dateCompare(today, actualDate);
    let localDateTime: any;
    if (timeDiff == 0)
      localDateTime = ", "+ moment(actualDate).calendar();
    else
      localDateTime = "on " + moment(actualDate).format('lll');
    return localDateTime
  }
}