import React from 'react';
import {hashHistory, Link} from 'react-router';
import Alert from 'react-s-alert';
import Loader from './loader.jsx';
import LogoUpload from './logo_upload.jsx';

class Topics extends React.Component {

  constructor(props) {
    super(props);
    this.addTopic = this.addTopic.bind(this);
    this.state = {loading_topics: true,  topics: [], error: ""}
  }

  componentDidMount() {
    var myHeaders = new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
        "x-access-token": window.localStorage.getItem('userToken')
    });
    var myInit = { method: 'GET',
               headers: myHeaders,
               };
    var that = this;
    fetch('/api/topics',myInit)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      if(response.error.error)
        Alert.error(response.error.message);
      else {
        that.setState({topics: response.data, loading_topics: false})
      }
    });

  }

  

  addTopic(e) {
    var topic = {
      name: encodeURIComponent(this.refs.topic_name.value),
      description: encodeURIComponent(this.refs.topic_description.value)
    };
    var myHeaders = new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
        "x-access-token": window.localStorage.getItem('userToken')
    });
    var myInit = { method: 'POST',
               headers: myHeaders,
               body: "name="+topic.name+"&description="+topic.description
               };
    var that = this;
    fetch('/api/topics/',myInit)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      if(response.error.error) {
         $('#addTopic').modal('hide');
         Alert.error(response.error.message);
      }
      else {
          $('#addTopic').modal('hide');
          var topics = that.state.topics;
          topics.push(response.data);
          that.setState({topics: topics});
          Alert.success('Topic has been added');
      }
    });
  }

  render () {
    if(this.state.loading_topics)
      return <Loader />
    else
        return(
          <div>
            <div className="row container">
          <div className="col-md-6">
            <button className="btn btn-default" data-toggle="modal" data-target="#addTopic">Add Topic</button>
            <br/>
            <br/>
              <div className="list-group bordered-scroll-box">
                  {this.state.topics.map(topic => (
                    <div key={topic.id} href="#" className="list-group-item">
                      {(topic.id !== 1)? <span className="pull-right">
                      <Link to={'topic/edit/'+topic.id} className="btn btn-default">Edit</Link>
                      </span>: ''}
                      <h4 className="list-group-item-heading">{topic.name}</h4>
                      <p className="list-group-item-text">{topic.description}</p>
                    </div>
                ))}</div>
          </div>
          
          
          </div>
          
          <div className="modal modal-fullscreen fade" id="addTopic" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div className="modal-body">
                  <center>
                  <div className="row">

                    <div className="col-md-6 col-sd-12">
                      <h1><b>Add Topic</b></h1>
                      <br/>
                        <form>
                          <div className="col-sm-12 form-group">
                            <input type="text" className="form-control" ref="topic_name" id="inputTopicName" placeholder="Name" />
                          </div>
                          <div className="col-sm-12 form-group">
                            <input type="text" className="form-control" ref="topic_description" id="inputTopicAbout" placeholder="Description" />
                          </div>
                      <div className="col-sm-12 form-group">
                        <button onClick={this.addTopic} className="btn btn-default btn-block btn-lg">Add Topic</button>
                      </div>
                    </form>
                    </div>
                  </div>
                </center>
                </div>

              </div>
            </div>
          </div>
          <LogoUpload />
        </div>);
  }
}

export default Topics;
