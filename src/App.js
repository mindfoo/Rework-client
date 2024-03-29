import React, { Component } from 'react';
import './App.css';

import Home from './components/home/Home';
import Footer from './components/footer/Footer';
import ServiceList from './components/services/ServiceList';
import ServiceDetails from './components/services/ServiceDetails';
import EditService from './components/services/EditService';
import Navbar from './components/navbar/Navbar';
import AddImage from './components/images/AddImage';
import Profile from './components/profile/Profile';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import NotFound from './components/notfound/NotFound';
import AuthService from './components/auth/auth-service';

import { Switch, Route, Redirect } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';



class App extends Component {
  service = new AuthService();

  state = {
    loggedInUser: null,
  }

  setCurrentUser = (userObj) => {
    this.setState({
      loggedInUser: userObj
    })
  }

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser = () => {
    if(this.state.loggedInUser === null) {
      this.service.loggedin() 
      .then(response => {console.log("response from fetch user", response);

        if (response._id) {
          console.log("COM SUCESSO");
          localStorage.setItem("loggedin", true)
          this.setCurrentUser(response)
        } else {console.log("FAILURE");
          localStorage.clear();
        }

      });
    }
  }


  render() {
    //this.fetchUser(); console.log(this.state.loggedInUser)
    
    return (
      <div className="App">
        <Navbar loggedInUser={this.state.loggedInUser} setCurrentUser={this.setCurrentUser} />

        <section className="maincontent">
          <Switch>
            <Route exact path="/" render={(props) => <Home isLoggedIn={this.state.loggedInUser} {...props} /> } />
            <Route path='/login' render={(props) => <Login setCurrentUser={this.setCurrentUser} {...props} /> } />
            <Route path='/signup' render={(props) => <Signup setCurrentUser={this.setCurrentUser} {...props} /> } />
            <Route exact path="/images/add" component={AddImage} />
            <Route exact path="/services" render={(props) => <ServiceList loggedInUser={this.state.loggedInUser} {...props} />} />
            <Route exact path="/services/:id" render={(props) => <ServiceDetails {...props} loggedInUser={this.state.loggedInUser} /> } />
            <Route exact path="/services/:id/edit" render={ (props) => {
              if (localStorage.getItem("loggedin")) {
                return <EditService loggedInUser={this.state.loggedInUser} {...props} />
              } else {
                return <Redirect to="/login" />
              }}}
            />

            <Route exact path="/profile/:id" render={ (props) => {
              if (localStorage.getItem("loggedin")) {
                return <Profile {...props} userInfo={this.state.loggedInUser}/>
              } else {
                return <Redirect to="/login" />
              }}}
            />
            <Route path="*" component={() => <NotFound/>}/>

          </Switch>
        </section>

        <Footer/>
      </div>
    );
  }
}

export default App;