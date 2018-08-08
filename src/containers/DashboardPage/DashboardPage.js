import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDeliverySchedule } from '../../actions';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PageHeader from '../../components/PageHeader/PageHeader';
import DeliverySchedule from '../../components/DeliverySchedule/DeliverySchedule';
import './DashboardPage.css';

class DashboardPage extends Component {
  constructor() {
    super();

    this.state = {
      value: 0
    }

    this.onTabChange = this.onTabChange.bind(this);
    this.onMonthChange = this.onMonthChange.bind(this);
  }

  componentDidMount() {
    const { search } = this.props.schedule;
    const token = this.props.auth.userToken;
    this.props.fetchDeliverySchedule(token, search);
  }

  onTabChange(event, value) {
    this.setState({ value });
  }

  onMonthChange(year, month) {
    const search = { year, month };
    const token = this.props.auth.userToken;
    this.props.fetchDeliverySchedule(token, search);
  }

  render() {
    const { isPending, current, search } = this.props.schedule;
    const { value } = this.state;
    return (
      <main>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.onTabChange}
        >
          <Tab label="납기현황" />
          <Tab label="동판필요품목" />
        </Tabs>
        {value === 0 && (
          <DeliverySchedule
            year={search.year}
            month={search.month}
            orders={current}
            isPending={isPending}
            onMonthChange={this.onMonthChange}
          />
        )}
        {value === 1 && <h1>동판필요품목 리스트</h1>}
      </main>
    );
  }
}

const mapStateToProps = ({ auth, schedule }) => {
  return { auth, schedule };
};

export default connect(
  mapStateToProps,
  { fetchDeliverySchedule }
)(DashboardPage);
