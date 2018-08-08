import React, { Component } from 'react';
import moment from 'moment';
import 'moment/locale/ko';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Spinner from '../../components/Spinner/Spinner';
import { comma } from '../../helpers/comma';
import './DeliverySchedule.css';

class DeliverySchedule extends Component {
  getCurrentMonth() {
    return moment()
      .year(this.props.year)
      .month(this.props.month);
  }

  onPrevClick() {
    const prevMonth = this.getCurrentMonth().subtract(1, 'months');
    this.props.onMonthChange(prevMonth.year(), prevMonth.month());
  }

  onNextClick() {
    const nextMonth = this.getCurrentMonth().add(1, 'months');
    this.props.onMonthChange(nextMonth.year(), nextMonth.month());
  }

  renderCalendarBody() {
    const currentMonth = this.getCurrentMonth();
    const startOfMonth = moment(currentMonth).startOf('month');
    const endOfMonth = moment(currentMonth).endOf('month');
    const dayOfStartOfMonth = startOfMonth.weekday();
    const dayOfEndOfMonth = endOfMonth.weekday();

    const startOfCalendar = startOfMonth.subtract(dayOfStartOfMonth, 'days');
    const endOfCalendar = endOfMonth.add(6 - dayOfEndOfMonth, 'days');

    let datesHTML = `
      <div class="calendar-weekday">
        <span>일</span>
      </div>
      <div class="calendar-weekday">
        <span>월</span>
      </div>
      <div class="calendar-weekday">
        <span>화</span>
      </div>
      <div class="calendar-weekday">
        <span>수</span>
      </div>
      <div class="calendar-weekday">
        <span>목</span>
      </div>
      <div class="calendar-weekday">
        <span>금</span>
      </div>
      <div class="calendar-weekday">
        <span>토</span>
      </div>
      `;

    for (
      let date = startOfCalendar;
      date <= endOfCalendar;
      date.add(1, 'days')
    ) {
      let className = 'calendar-dates';
      if (currentMonth.month() > date.month()) className += ' prevMonth';
      if (currentMonth.month() < date.month()) className += ' nextMonth';

      const ordersHTML = this.getOrdersForDate(date.format('YYYY-MM-DD'));

      datesHTML += `
        <div class="${className}">
          <div class="date-wrapper">
            <span class="date">${date.format('D')}</span>
            <span class="weekday">${date.format('(ddd)')}</span>
          </div>
          <div class="date-orders">
            ${ordersHTML}
          </div>
        </div>
        `;
    }

    return datesHTML;
  }

  getOrdersForDate(date) {
    const { orders } = this.props;
    const ordersForDate = orders.filter(
      order => moment(order.deliver_by).format('YYYY-MM-DD') === date
    );
    let ordersHTML = '';
    ordersForDate.forEach(
      ({
        account_name,
        product_name,
        product_thick,
        product_length,
        product_width,
        order_quantity,
        is_completed
      }) => {
        let className = 'order';
        if (is_completed) className += ' completed';
        ordersHTML += `
          <div class="${className}">
            <span class="order__account-name">
              ${account_name}
            </span>
            <span class="order__product-name">
              ${product_name}
            </span>
            <span class="order__product-size">
              (${product_thick}x${product_length}x${product_width})
            </span>
            <span class="order__order-quantity">
              ${comma(order_quantity)}매
            </span>
          </div>
        `;
      }
    );

    return ordersHTML;
  }

  render() {
    const { year, month, isPending } = this.props;
    return (
      <div className="calendar">
        <div className="calendar-header">
          <IconButton onClick={this.onPrevClick.bind(this)}>
            <Icon>navigate_before</Icon>
          </IconButton>
          <span className="calendar-month">
            {year}년 {month + 1}월
          </span>
          <IconButton onClick={this.onNextClick.bind(this)}>
            <Icon>navigate_next</Icon>
          </IconButton>
        </div>
        {isPending ? (
          <Spinner />
        ) : (
          <div
            className="calendar-body"
            dangerouslySetInnerHTML={{ __html: this.renderCalendarBody() }}
          />
        )}
      </div>
    );
  }
}

export default DeliverySchedule;
