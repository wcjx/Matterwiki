import React from 'react';
import {hashHistory} from 'react-router';
import Alert from 'react-s-alert';
import Loader from './loader.jsx';
import BraftEditor from 'braft-editor';

class EditArticle extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {body: "",title: "", topic_id: "", topics: [], loading: true, editor:null};
  }

  handleChange(newState) {
    this.setState({editor: newState, title: this.refs.title.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    let body =this.state.editor.toHTML();
    var title = this.refs.title.value;
    var topicId = this.refs.topic.value;
    var what_changed = this.refs.what_changed.value;
    if(body && title && topicId && what_changed) {
          var myHeaders = new Headers({
              "Content-Type": "application/x-www-form-urlencoded",
              "x-access-token": window.localStorage.getItem('userToken')
          });
          var myInit = { method: 'PUT',
                     headers: myHeaders,
                     body: "id="+this.props.params.articleId+"&title="+encodeURIComponent(title)+"&body="+encodeURIComponent(body)+"&topic_id="+topicId+"&user_id="+window.localStorage.getItem("userId")+"&what_changed="+what_changed
                     };
          var that = this;
          fetch('/api/articles/',myInit)
          .then(function(response) {
            return response.json();
          })
          .then(function(response) {
            if(response.error.error)
              Alert.error(response.error.message);
            else {
                Alert.success("Article has been successfully saved");
                hashHistory.push('article/'+that.props.params.articleId);
            }
          });
    }
    else {
      Alert.error("Article Body, Title, Topic and Change Info is required.");
    }
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
    fetch('/api/articles/'+this.props.params.articleId,myInit)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      if(response.error.error)
        Alert.error(response.error.message);
      else {
          console.log(response.data.body)
        that.setState({editor: BraftEditor.createEditorState(response.data.body), title: response.data.title, topic_id: response.data.topic_id})
      }
      that.setState({loading: false});
    });
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
        that.setState({topics: response.data})
      }
    });
  }

  render() {
    if(this.state.loading)
      return <Loader/>;
    else
      return (
        <div className="new-article">
          <div className="row">
            <div className="col-md-12">
              <input
                onChange={this.handleChange}
                ref="title"
                className="form-control input-title"
                value={this.state.title}
                 />
           </div>
           </div>
           <br/>
           <div className="row">
            <div className="col-md-12 new-article-form">
            <BraftEditor value={this.state.editor} onChange={this.handleChange}
            contentStyle={{minHeight: 210, boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)'}}
            />
          <input id="my_input" type="hidden" value={this.state.body} ref="body" onChange={this.handleChange}/>
                 <br/>
                 <label>Choose topic</label>
                 <select className="form-control topic-select" ref="topic" defaultValue={this.state.topic_id}>
                   {this.state.topics.map(topic => (
                     <option value={topic.id} key={topic.id}>{topic.name}</option>
                   ))}
                 </select>
                 <br/>
                 <div className="whatwrapper">
                 <label>What improvements did you make in this edit?</label>
                 <textarea
                   ref="what_changed"
                   className="form-control what_changed what"
                   id="what"
                   placeholder="Example: Fixed a typo. It's grammer not grammar"
                    />
                  <p className="help-block">Keep it short and descriptive :)</p>
                  </div>
                  <br/>
            </div>

        <div className="row">
          <div className="col-md-12">
            <button className="btn btn-default btn-block btn-lg" onClick={this.handleSubmit}>Update Article</button>
          </div>
        </div>
      </div>
      </div>
      );
  }
}

export default EditArticle;
