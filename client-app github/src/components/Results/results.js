function Results(props) {
  const serverResponse = props;
  console.log(props.serverResponse);

  return (
    <div>
      <h2>Results</h2>
      <ul>
        <li>
          <p>Takeoff Status: {props.serverResponse.status} </p>
          <p>The total number of matches is: {props.serverResponse.takeoffCount}</p>
        </li>
      </ul>
    </div>
  );
}

export default Results;
