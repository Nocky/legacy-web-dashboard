import * as React from 'react'
import ReactWinJS = require ('react-winjs') 
import Calc100PercentMinus from '../Utils/Calc100PercentMinus'
import CheckExistence from '../Utils/CheckExistence'
import ProfilePicture from './ProfilePicture'
let WinJS = require('winjs')

export default class PeoplePage extends React.Component<any, any> {

    constructor (props) {
        super (props)
        this.state = {
            layout: { type: WinJS.UI.ListLayout },
            selectedPeople: [],
            selectionMode: false
        }
    }

    personRenderer = ReactWinJS.reactRenderer(function (person) {
        return (
            <div>
                <ProfilePicture backgroundUrl={person.data.picture} size={34} />
                <span className="name">{person.data.name}</span>
            </div>
        )
    })

    groupHeaderRenderer = ReactWinJS.reactRenderer(function (item) {
        return (
            <div>{item.data.title}</div>
        )
    })

    handleToggleSelectionMode =  () => {
        this.setState({selectionMode: !this.state.selectionMode})
        this.props.onNavigate(['people'])
        // this.refs.listView.winControl.selection.clear()
    }

    handleSelectionChanged = (eventObject) => {
        let listView = eventObject.currentTarget.winControl
        let indices = listView.selection.getIndices()
        this.setState({ selectedPeople: indices })
        this.props.onNavigate(indices.length === 1 && !this.state.selectionMode ? ['people', indices[0]] : ['people'])
    }

    handleContentAnimating (eventObject) {
        // Disable ListView's entrance animation
        if (eventObject.detail.type === 'entrance') {
            eventObject.preventDefault()
        }
    }

    handleDelete = () => {
        let people = this.props.people
        let indices = this.state.selectedPeople
        indices.sort()
        indices.reverse()
        indices.forEach(function (i: number) {
            people.splice(i, 1)
        })
        this.setState({
            selectedPeople: [],
            selectionMode: false
        })
        this.props.changePeople(people)
    }
    
    renderPeoplePane (peoplePaneWidth) {

        let deleteCommand = (
            <ReactWinJS.ToolBar.Button
                key="delete"
                icon="delete"
                label="delete"
                priority={0}
                disabled={this.state.selectedPeople.length === 0}
                onClick={this.handleDelete}
            />
        )
        if (this.props.people.dataSource) {
            return (
                <div className="peopleSearchPane" style={{height: '100%', width: peoplePaneWidth, display: 'inline-block', verticalAlign: 'top'}}>
                    <ReactWinJS.ToolBar className="peopleToolBar">
                        <ReactWinJS.ToolBar.Button
                            key="edit"
                            icon="edit"
                            label="Edit"
                            priority={4} 
                        />
                        <ReactWinJS.ToolBar.Button
                            key="favorite"
                            icon="favorite"
                            label="Favorite"
                            priority={3} 
                        />
                        <ReactWinJS.ToolBar.Button
                            key="link"
                            icon="link"
                            label="Link"
                            priority={2} 
                        />
                        <ReactWinJS.ToolBar.Button
                            key="refresh"
                            icon="refresh"
                            label="Refresh"
                            priority={1} 
                        />

                        <ReactWinJS.ToolBar.Button
                            key="add"
                            icon="add"
                            label="Add"
                            priority={0} 
                        />
                        
                        {this.state.selectionMode ? deleteCommand : null}
                        
                        <ReactWinJS.ToolBar.Toggle
                            key="select"
                            icon="bullets"
                            label="Select"
                            priority={0}
                            selected={this.state.selectionMode}
                            onClick={this.handleToggleSelectionMode}
                        />
                    </ReactWinJS.ToolBar>

                    <ReactWinJS.ListView
                        ref="listView"
                        className="peopleListView win-selectionstylefilled"
                        style={{height: 'calc(100% - 48px)'}}
                        itemDataSource={this.props.people.dataSource}
                        groupDataSource={this.props.people.groups.dataSource}
                        layout={this.state.layout}
                        itemTemplate={this.personRenderer}
                        groupHeaderTemplate={this.groupHeaderRenderer}
                        selectionMode={this.state.selectionMode ? 'multi' : 'single'}
                        tapBehavior={this.state.selectionMode ? 'toggleSelect' : 'directSelect'}
                        onSelectionChanged={this.handleSelectionChanged}
                        onContentAnimating={this.handleContentAnimating}
                    />
                </div>
            )
        } else {
            return <span />
        }
        
    }

    renderProfilePane (selectedIndex, peoplePaneWidth) {
        if (selectedIndex === null) {
            return (
                <div className="profilePane" style={{height: '100%', width: Calc100PercentMinus(peoplePaneWidth), display: 'inline-block', verticalAlign: 'top'}}>
                    <div style={{display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                        <h1 className="win-h1" style={{color: 'grey'}}>No Selection</h1>
                    </div>
                </div>
            )
        } else {
            let selectedPerson = this.props.people.getAt(selectedIndex)
            return (

                // language

                <div className="profilePane" style={{height: '100%', width: Calc100PercentMinus(peoplePaneWidth), display: 'inline-block', verticalAlign: 'top'}}>
                    <div className="profileHeader">
                        <div className="name">{CheckExistence(selectedPerson.name)}</div>
                        <div className="personInfo">
                            <ProfilePicture backgroundUrl={CheckExistence(selectedPerson.picture)} size={100} />
                            <div className="profileStatus">
                                <span className="message">
                                    <strong>ID: </strong>{selectedPerson.id}
                                </span>
                                <span className="source"> last login: {CheckExistence(selectedPerson.last_login)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="separator" />
                    <div className="profileContent">
                        <ul>
                            <li>
                                <div>
                                    <strong className="firstname">First Name: &nbsp;</strong> 
                                    <span>{CheckExistence(selectedPerson.firstname)}</span>
                                </div>
                            </li>
                            <li>
                                <span className="phoneIcon" />
                                <div className="callContent">
                                    <a href={`call:${selectedPerson.mobile}`}>Mobile:</a>
                                    <div className="number">{CheckExistence(selectedPerson.mobile)}</div>
                                </div>
                            </li>
                            <li>
                                <span className="phoneIcon" />
                                <div className="callContent">
                                    <a href={`call:${selectedPerson.phone}`}>Phone:</a>
                                    <div className="number">{CheckExistence(selectedPerson.phone)}</div>
                                </div>
                            </li>
                            <li>
                                <span className="phoneIcon" />
                                <div className="callContent">
                                    <a href={`call:${selectedPerson.phone2}`}>Phone 2:</a>
                                    <div className="number">{CheckExistence(selectedPerson.phone2)}</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            )
        }
    }

    render () {
        let selectedIndex = this.props.location.length >= 2 ? this.props.location[1] : null

        if (this.props.mode === 'small') {
            if (selectedIndex === null) {
                return this.renderPeoplePane('100%')
            } else {
                return this.renderProfilePane(selectedIndex, 0)
            }
        } else {
            let peoplePaneWidth = 320
            return (
                <div style={{height: '100%'}}>
                    {this.renderPeoplePane(peoplePaneWidth)}
                    {this.renderProfilePane(selectedIndex, peoplePaneWidth)}
                </div>
            )
        }
    }
}