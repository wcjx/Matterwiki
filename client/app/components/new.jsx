import React from 'react';
import {hashHistory} from 'react-router';
import Loader from './loader.jsx';
import Alert from 'react-s-alert';
import BraftEditor from 'braft-editor';
import Markdown from 'braft-extensions/dist/markdown'
import Table from 'braft-extensions/dist/table'
import handleError from '../handle_error';
BraftEditor.use(Markdown())
BraftEditor.use(Table())

class NewArticle extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { topics: [], error: "", loading: true, editor: BraftEditor.createEditorState(null)};
  }

  handleChange(newState) {
    this.setState({editor: newState});
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
      handleError(response.error.message,response.code);
      else {
        that.setState({loading: false});
        that.setState({topics: response.data})
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let body =this.state.editor.toRAW();
    // var body = this.refs.body.value;
    var title = this.refs.title.value;
    var topicId = this.refs.topic.value;
    if(body && title && topicId) {
        var myHeaders = new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
            "x-access-token": window.localStorage.getItem('userToken')
        });
        var myInit = { method: 'POST',
                   headers: myHeaders,
                   body: "title="+encodeURIComponent(title)+"&body="+encodeURIComponent(body)+"&topic_id="+topicId+"&user_id="+window.localStorage.getItem("userId")
                   };
        var that = this;
        that.setState({loading:true});
        fetch('/api/articles/',myInit)
        .then(function(response) {
          return response.json();
        })
        .then(function(response) {
          if(response.error.error){
            that.setState({loading:false});
            Alert.error(response.error.message);
          }
          else {
              Alert.success("Article has been successfully saved")
              hashHistory.push('article/'+response.data.id+'?new=true');
          }
        });
      }
    else {
      Alert.error("Article Body, Title and Topic Information is required.");
    }
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
              ref="title"
              className="form-control input-title"
              placeholder="Enter article title..."
               />
         </div>
         </div>
         <br/>
         <div className="row">
          <div className="col-md-12 new-article-form">
            <BraftEditor value={this.state.editor} onChange={this.handleChange}
            placeholder={'Write here...'} language='en'
            contentStyle={{minHeight: 210, boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)'}}
            />
            <input id="my_input" type="hidden" value="" ref="body" onChange={this.handleChange}/>
               <br/>
               <label>Choose topic</label>
               <select className="form-control topic-select" ref="topic">
                 {this.state.topics.map(topic => (
                   <option value={topic.id} key={topic.id}>{topic.name}</option>
                 ))}
               </select>
          </div>
        </div>
        <br/>
        <br/>
        <div className="col-md-12">
          <button className="btn btn-default btn-block btn-lg" onClick={this.handleSubmit}>Create Article</button>
        </div>
      </div>
    );
  }
}

export default NewArticle;
