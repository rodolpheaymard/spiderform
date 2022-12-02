import SfComponent from "./SfComponent";

class SfFormCreation extends SfComponent {
    
    constructor(props) {
      super(props);
      this.state = {
      }
    }


    render()
    {

      return ( <>
                <div className="sfFormCreation">
                    <p> FORM CREATION  </p>
                  <p>Liste des questions</p> 
                  <p>ajouter une question </p> 
                </div>
                </>              
         );
    }
}

export default SfFormCreation;