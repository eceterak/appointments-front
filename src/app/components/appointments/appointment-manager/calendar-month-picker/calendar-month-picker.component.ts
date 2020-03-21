import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DepartmentService } from 'src/app/components/departments/department.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from 'src/app/shared/utilities.service';
import { Department } from 'src/app/models/department.model';
import { HttpDataResponse } from 'src/app/interfaces/httpDataResponse.interface';
import * as _moment from 'moment';
import { Doctor } from 'src/app/models/doctor.model';
import { switchMap } from 'rxjs/operators';
import { empty } from 'rxjs';
import { AppointmentService } from '../../appointment.service';

@Component({
    selector: 'app-calendar-month-picker',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './calendar-month-picker.component.html',
    styleUrls: ['./calendar-month-picker.component.scss']
})

export class CalendarMonthPickerComponent implements OnInit {
    pickerForm: FormGroup;
    departments: Department[];
    doctors: Doctor[];
    getErrorMessage = UtilitiesService.getErrorMessage;

    constructor(
        private departmentService: DepartmentService,
        private appointmentService: AppointmentService
    ) {}

    ngOnInit() {
        this.initForm();

        this.departmentService.getSelectDepartments().subscribe(
            (response: HttpDataResponse) => {
                this.departments = response.data;
            },
            (error: HttpErrorResponse) => {
                console.log(error);
            }
        );

        this.pickerForm.get('department').valueChanges.pipe(
            switchMap((department: Department) => {
                this.pickerForm.get('doctor').setValue(null);
                this.doctors = null;

                if(department) {
                    return this.departmentService.getDoctors(department.id)
                } else {
                    return empty();
                }
            })
        ).subscribe((doctors: Doctor[]) => this.doctors = doctors);

        this.pickerForm.valueChanges.subscribe(
            (formValues) => {
                if(this.pickerForm.valid) {
                    this.appointmentService.calendarDataChanged.next(formValues);
                }
            }
        );
    }

    initForm(): void {
        this.pickerForm = new FormGroup({
            'department': new FormControl(null, [Validators.required]),
            'doctor': new FormControl(null, [Validators.required]),
            'date': new FormControl(_moment(), [Validators.required])
        });
    }

    displayDepartmentName(department: Department): string {
        return department && department.name ? department.name : '';
    }

    displayDoctorName(doctor: Doctor): string {
        return doctor && doctor.name ? doctor.getFullName() : '';
    }
}