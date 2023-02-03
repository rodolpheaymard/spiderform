import React from 'react';



class SfComponent extends React.Component {
    
  static DisplayMobile = 'mobile';
  static DisplayDesktop = 'desktop';
  
  constructor(props) {
    super(props);
    this.world = props.world;     
    this.state = {
      displaymode : SfComponent.DisplayDesktop
    }
  }

  componentDidMount(){
      this.updateDimensions();
      window.addEventListener("resize", this.updateDimensions); 
  }

  componentWillUnmount(){
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;

    let displaymode = SfComponent.DisplayDesktop;
    if( windowWidth < 1000 && windowWidth < windowHeight) 
    {
      displaymode =SfComponent.DisplayMobile;
    }

    this.setState({ displaymode : displaymode });
  }

  isDesktop = () =>   {
    return this.state.displaymode === SfComponent.DisplayDesktop;
  }

  isMobile = () => {
    return this.state.displaymode === SfComponent.DisplayMobile;
  }    
    
  isNull(obj)
  {
    return (obj === null || obj === undefined);
  }
  
  isOk(obj)
  {
    return (obj !== null && obj !== undefined);
  }

  getRscText(key)
  {
    return this.world.getRscText(key);
  }
}

export default SfComponent;