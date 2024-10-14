import { Controller, Get, Post, Render, Body, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { BookingDto } from './booking.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }
  @Get('success')
  @Render('success')
  showSuccessPage() {
    return {
      message: 'Rendben',
    };
  }
  @Get('booking')
  @Render('bookingForm')
  showBookingForm() {
    return { errors : []};
  }
  @Post('booking')
  @Render('bookingForm')
  handleBookingForm(
    @Body() bookingData: BookingDto,
    @Res() response: Response,
  ) {
    const errors = [];
    if (!bookingData.name || !bookingData.name.trim()) {
      errors.push({ message: 'A név megadása kötelező!' });
    }

    const emailValidation = /.+@.+\..+/;
    if (!emailValidation.test(bookingData.email)) {
      errors.push({ message: 'Érvénytelen email cím!' });
    }

    const currentDate = new Date();
    if (!bookingData.date || new Date(bookingData.date) < currentDate) {
      errors.push({ message: 'Érvénytelen dátum!' });
    }

    const guests = parseInt(bookingData.guests, 10);
    if (isNaN(guests) || guests < 1 || guests > 10) {
      errors.push({ message: '1 és 10 vendég között lehet foglalni!' });
    }

    if (errors.length > 0) {
      response.render('bookingForm', { errors: errors });
    } else {
      response.redirect('/success');
    }
  }
}
