interface DieProps {
  value: number;
  isHeld: boolean;
  id: string;
}

export default function Die(props: DieProps) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "",
  };

  return (
    <div className="dice__number" style={styles} onClick={props.holdDice}>
      <h2 className="die-num">{props.value}</h2>
    </div>
  );
}
