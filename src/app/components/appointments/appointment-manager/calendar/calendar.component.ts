import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Doctor } from 'src/app/models/doctor.model';
import { MatDialog } from '@angular/material';
import { AppointmentDialogComponent } from '../../appointment-dialog/appointment-dialog.component';
import * as moment from 'moment';
import { AppointmentService } from '../../appointment.service';
import { MonthPickerResponse } from 'src/app/interfaces/montPickerResponse.interface';
import { Department } from 'src/app/models/department.model';
import { CalendarRow } from 'src/app/interfaces/calendarRow.interface';
import { CalendarData } from 'src/app/interfaces/calendarData.interface';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit, OnDestroy {

    calendarDataChangedSubscription: Subscription;
    appointmentsChangedSubscription: Subscription;
    appointmentsTable: CalendarRow[];
    doctor: Doctor;
    department: Department;

    constructor(
        private appointmentService: AppointmentService,
        private dialog: MatDialog
    ) {}

    ngOnInit() {
        this.calendarDataChangedSubscription = this.appointmentService.calendarDataChanged.pipe(
            switchMap((calendarData: CalendarData) => {
                this.department = calendarData.department;
                this.doctor = calendarData.doctor;

                return this.appointmentService.getAllAppointments(calendarData.doctor.id, calendarData.date)
            })
        ).subscribe((appointmentsTable: CalendarRow[]) => this.appointmentsTable = appointmentsTable);

        this.appointmentsChangedSubscription = this.appointmentService.appointmentsChanged.subscribe(
            (appointmentsTable: CalendarRow[]) => this.appointmentsTable = appointmentsTable
        );
    }

    ngOnDestroy() {
        this.calendarDataChangedSubscription.unsubscribe();
        this.appointmentsChangedSubscription.unsubscribe();
    }

    get slots(): string[] {
        return ['8am', '9am', '10am', '11am', 'Noon', '1pm', '2pm', '3pm', '4pm'];
    }

    onManageAppointment(slot: number, date: moment.Moment, id: number): void {
        this.dialog.open(AppointmentDialogComponent, {
            width: '860px',
            position: {
                top: '50px'
            },
            data: {
                slot: slot,
                date: date,
                doctor: this.doctor,
                department: this.department,
                id: id
            }
        });
    }
}
