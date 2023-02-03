import React from "react";
import { Select, Space } from 'antd';
import SfComponent from "./SfComponent";
import SfListOfObjects from "./SfListOfObjects";
import { GlobalContext } from "./GlobalContext";
import DownloadLink from "react-download-link";


class SfFormCreation extends SfComponent {
  static contextType = GlobalContext;
 
    constructor(props) {
      super(props);
   
      this.state = {
        currObjType : "",
        statusMessage : this.getRscText("data_loading")
      };

      this.onDataLoaded = this.onDataLoaded.bind(this);
      this.onErrorDataLoaded = this.onErrorDataLoaded.bind(this);
      this.handleChooseType = this.handleChooseType.bind(this);          
      this.exportFullData = this.exportFullData.bind(this);          
    }

    componentDidMount()
    { 
      this.world.loadData(this.onDataLoaded, this.onErrorDataLoaded);
    }

    onErrorDataLoaded(response)
    {
      this.setState({ statusMessage : this.getRscText("err_dataloading")});
    }    

    onDataLoaded(response)
    {      
      if (this.context.session != null)
      {
        this.setState({ 
          statusMessage : "data loaded",
          currObjType : this.context.session.chosenObjectType });
      }      
    }

    handleChooseType(chosenValue) 
    {
      if (this.context.session != null)
      {
        let newsession = this.context.session;
        newsession.chosenObjectType = chosenValue;
        this.context.setSession(newsession);
      }
       
      this.setState({ currObjType : chosenValue });  
    }

    exportFullData()
    {
      return  this.world.backupObjects();
    }

    render()
    {
      return ( <>                 
                  <Space size="large" >
                    <div className="sfPageTitle"> Administration Back-Office </div>
                    <Select   style={{ width: 120 }}  onChange={this.handleChooseType}
                              defaultValue={this.state.currObjType}  
                              value={this.state.currObjType}  
                              options={this.world.getTypesList()} />
                    <div className="sfMessage">{this.state.statusMessage}</div>  
                    <DownloadLink    label= {this.getRscText("dl_full")}
                                     filename="myspiderdata.txt"
                                     exportFile={() => this.exportFullData()}
                                    />
                    
                    </Space>

                  <SfListOfObjects world={this.world} objectType={this.state.currObjType} />
                </>              
         );     
    }
}

export default SfFormCreation;