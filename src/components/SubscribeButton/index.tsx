import styles from './styles.module.scss';

interface Props {
  priceId: string;
}

export function SubscribeButton({ priceId }: Props): JSX.Element {
  return (
    <button type="button" className={styles.subscribeButton}>
      Subscribe now
    </button>
  );
}
