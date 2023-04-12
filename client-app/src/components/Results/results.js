import './results.css';

function Results(props) {
  //const serverResponse = props; // this is useless
  //console.log(props.serverResponse);
  //console.log('Function Called');

  return (
    <div className="table">
      <table>
        <tr>
          <th>Item</th>
          <th>Count</th>
          <th>Status</th>
        </tr>
        {props.serverResponse.map((val, key) => {
          return (
            <tr key={key}>
              <td>
                <img alt="template" src={val.templateImg} max-height={75} max-width={150}></img>
              </td>
              <td>{val.takeoffCount}</td>
              <td>{val.status}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
export default Results;
