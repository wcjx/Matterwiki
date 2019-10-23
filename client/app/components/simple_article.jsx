import React from 'react';
import {hashHistory} from 'react-router';
import Loader from './loader.jsx';
import Alert from 'react-s-alert';
import BraftEditor from 'braft-editor';

class SimpleArticle extends React.Component {
  constructor(props) {
    super(props);
    this.handleRevert=this.handleRevert.bind(this);
    this.state = { article: {}};
    this.submitted=false;
  }

  componentWillReceiveProps(nextProps){
    var myHeaders = new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
        "x-access-token": window.localStorage.getItem('userToken')
    });
    var myInit = { method: 'GET',
               headers: myHeaders,
               };
    var that = this;
    fetch('/api/archives/'+nextProps.archiveId,myInit)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      if(response.error.error)
        Alert.error(response.error.message);
      else {
        that.setState({article: response.data})
      }
    });
  }

  handleRevert(e) {
    e.preventDefault();
    let body =this.state.article.body;
    let title =this.state.article.title;
    let articleId =this.state.article.article_id;
    let what_changed = "Revert to \""+this.state.article.what_changed+"\"";
    var myHeaders = new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
        "x-access-token": window.localStorage.getItem('userToken')
    });
    var myInit = { method: 'PUT',
                headers: myHeaders,
                body: "id="+articleId+"&title="+encodeURIComponent(title)+"&body="+encodeURIComponent(body)+"&user_id="+window.localStorage.getItem("userId")+"&what_changed="+what_changed
                };
    var that = this;
    if(!that.submitted){
      that.submitted=true;
      fetch('/api/articles/',myInit)
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        if(response.error.error){
          that.submitted=false;
          Alert.error(response.error.message);
        }
        else {
            Alert.success("Article has been successfully reverted");
            hashHistory.push('article/'+articleId);
        }
      });
    }
  }

  getRawMarkupBody() {
    return BraftEditor.createEditorState(this.state.article.body);
  }


  render () {
    if(this.state.article && this.state.article.user) {
      return(<div className="row">
          <button className="btn btn-default" style={{position:'absolute',right:'15px',top:'-6px'}} onClick={this.handleRevert}>Revert</button>
          <div className="col-md-12">
            <div className="article-heading">
                <h1 className="single-article-title">{this.state.article.title}
                </h1>
                <div className="single-article-meta">
                  Edited by <b>{this.state.article.user.name}</b>
              </div>
            </div>
            <BraftEditor controlBarStyle={{display:"none"}} value={ this.getRawMarkupBody()} readOnly={true}/>
          </div>
          </div>
            );
    }
    else {
      return <center><p className="help-block">Please select the archive</p></center>;
    }
  }
}

export default SimpleArticle;
