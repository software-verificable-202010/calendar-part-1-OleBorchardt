import React from "react";
import moment from "moment";
import "./calendar.css";
import SelectList from "../SelectList/selectList";

export default class Calendar extends React.Component {

    constructor(props) {
        super(props);
        this.style = props.style || {};
        this.state = {
            dateContext : moment(),
            today : moment(),
            showMonthPopup: false,
            showYearNavigator: false
        }
    }

    daysOfTheWeekShort = moment.weekdaysShort(true);
    monthsOfTheYear = moment.months();

    getCurrentMoment = () => {
        return moment()
    }
    
    generateListOfWrappedDays() {

        let days = [];

        let firstDayOfMonth = parseInt(moment(this.state.dateContext).startOf("month").format("d"));
        let numberOfDaysInMonth = this.state.dateContext.daysInMonth();

        while(days.length % this.daysOfTheWeekShort.length !== 0 || days.length < numberOfDaysInMonth + firstDayOfMonth) {

            let dayCount = days.length;
            let dayInMonth = dayCount - firstDayOfMonth + 1;
            
            if(dayCount < firstDayOfMonth || dayCount >= numberOfDaysInMonth + firstDayOfMonth) {
                
                days.push(<td key={dayCount} className="empty-slot">{""}</td>);
            
            } else {
                
                let momentOfDayInMonth = moment(this.state.dateContext).set("date", dayInMonth);
                
                let classNameOfTag = ((dayCount % this.daysOfTheWeekShort.length === 0 ||
                    dayCount % this.daysOfTheWeekShort.length === 6) 
                    ? "weekend" 
                    : "day");
                classNameOfTag = (this.getCurrentMoment().format("D.M.Y") === momentOfDayInMonth.format("D.M.Y") 
                    ? "current-day" 
                    : classNameOfTag);
                classNameOfTag = (this.state.selectedDayMoment != null && 
                    momentOfDayInMonth.format("D.M.Y") === this.state.selectedDayMoment.format("D.M.Y") 
                    ? "selected-day" 
                    : classNameOfTag);
                
                days.push(
                    <td key = {dayCount} className={classNameOfTag}>
                        <span onClick={(e) => {this.onDayClick(e, momentOfDayInMonth)}}>{dayInMonth}</span>
                    </td>
                );
            }
        }
        return days;
    }

    generateMatrixOfDays(days) {
        
        let matrix = [];
        let index = 0;

        for(let daysCursor = 0; daysCursor < days.length; ++daysCursor) {
            
            if((daysCursor % this.daysOfTheWeekShort.length) === 0 && daysCursor !== 0) {
                
                matrix.push(days.slice(index,daysCursor));
                index = daysCursor;
            
            } else if(daysCursor === (days.length - 1)) {
                
                matrix.push(days.slice(index, days.length));
            }
        }
        return matrix;
    }

    formatDaysOfMonth() {

        let listOfDays = this.generateListOfWrappedDays();
        let matrixOfDays = this.generateMatrixOfDays(listOfDays);
        
        return matrixOfDays;

    }

    nextMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onNextMonth && this.props.onNextMonth();
    }

    previousMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).subtract(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onNextMonth && this.props.onNextMonth();
    }

    setMonth = (month) => {
        let monthNumber = this.monthsOfTheYear.indexOf(month);
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("month", monthNumber);
        this.setState({
            dateContext: dateContext
        });
    }

    onMonthChange = (event, month) => {
        this.setMonth(month);
        this.props.onMonthChange && this.props.onMonthChange()
    }

    MonthNavigator = () => {
        return (
            <span className="month-label" onClick={(e) => {this.setState({showMonthPopup: !this.state.showMonthPopup})}}>
                {this.state.dateContext.format("MMMM")}
                {this.state.showMonthPopup &&
                    <SelectList data = {this.monthsOfTheYear} onSelectListChange={this.onMonthChange}/>
                }
            </span>
        );
    }

    setYear = (year) => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("year", year);
        this.setState({
            dateContext: dateContext
        });
    }

    onYearChange = (event) => {
        this.setYear(event.target.value);
        this.props.onYearChange && this.props.onYearChange(event, event.target.value);
    }

    onKeyUpYear = (event) => {
        if (event.which === 13) { //13 is the code for the ENTER-Key
            this.setYear(event.target.value);
            this.setState({
                showYearNavigator: false
            });
        } else if (event.which === 27) { //27 is the code for the ESC-Key
            this.setYear(event.target.defaultValue);
            this.setState({
                showYearNavigator: false
            });
        }
    }

    YearNavigator = () => {
        return(
            this.state.showYearNavigator ?
            <span>
            <input
                className = "editor-tag"
                defaultValue = {this.state.dateContext.format("Y")}
                onKeyUp={(e) => this.onKeyUpYear(e)}
                onChange = {(e) => this.onYearChange(e)}
                type="number"
                placeholder="year"/>
            </span>
            :
            <span className="label-year"
                onDoubleClick={(e)=>{this.setState({
                    showYearNavigator: true
                    })}}>
                {this.state.dateContext.format("Y")}
            </span>
        );
    }

    onDayClick = (e, clickedDayMoment) => {
        
        if(this.state.selectedDayMoment!=null && this.state.selectedDayMoment.format("D.M.Y") === clickedDayMoment.format("D.M.Y")){
            this.setState({
                selectedDayMoment: null
            });
            this.props.onDayUnselect && this.props.onDayUnselect(e, clickedDayMoment);
        } else {
            this.setState({
                selectedDayMoment: clickedDayMoment
            });
            this.props.onDaySelect && this.props.onDaySelect(e, clickedDayMoment);
        }

        
    }

    render() {

        let daysOfTheWeekWrapped = this.daysOfTheWeekShort.map((day) => {
            return (
                <td key = {day} className = "week-day">{day}</td>
            );
        })
        
        let calenderDaysWrapped = this.formatDaysOfMonth().map((day, i) => {
            return (
                <tr key = {i}>
                    {day}
                </tr>
            )
        })
        
        return (
            <div className = "calendar-container" style = {this.style}>
                <table className="calendar">
                    <thead>
                        <tr className="calendar-header">
                            <td colSpan="2" className="navigate-months">
                                <i className="prev fa fa-fw fa-chevron-left" onClick={(e)=> this.previousMonth()}/>
                            </td>
                            <td colSpan="3">
                                <this.MonthNavigator/>
                                {" "}
                                <this.YearNavigator/>
                            </td>
                            <td colSpan="2" className="navigate-months">
                                <i className="prev fa fa-fw fa-chevron-right" onClick={(e)=> this.nextMonth()}/>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {daysOfTheWeekWrapped}
                        </tr>
                        {calenderDaysWrapped}
                    </tbody>
                </table>
            </div>
        );
    }
}