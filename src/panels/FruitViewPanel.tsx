import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import {
  Card,
  Form,
  Select,
  InputNumber,
  Button,
  Typography,
  List,
  message as antdMessage,
} from 'antd';
import { COLORS } from '../constants/colors';
import { MockFruitMachine, Fruit } from '../../engine/MockFruitMachine';
const { Title, Text } = Typography;
const FRUIT_LIST: Fruit[] = ['apple', 'banana', 'orange'];
const machine = new MockFruitMachine();

const ViewPanelWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100%;
  padding: 32px 0;
`;

const StyledCard = styled(Card)`
  && {
    border-radius: 12px;
    box-shadow: 0 2px 12px ${COLORS.fruitViewBoxShadow};
    min-width: 350px;
    max-width: 400px;
    .ant-card-body {
      padding: 32px;
    }
  }
`;

const MessageWrapper = styled.div`
  min-height: 24px;
  margin-bottom: 16px;
`;

export const FruitViewPanel: React.FC = () => {
  const [inventory, setInventory] = useState(machine.getInventory());
  const [selectedFruit, setSelectedFruit] = useState<Fruit>('apple');
  const [amount, setAmount] = useState(1);
  const [message, setMessage] = useState('');

  const fruitOptions = useMemo(
    () =>
      FRUIT_LIST.map((fruit) => (
        <Select.Option key={fruit} value={fruit}>
          {fruit.charAt(0).toUpperCase() + fruit.slice(1)}
        </Select.Option>
      )),
    []
  );

  const inventoryList = useMemo(
    () =>
      Object.entries(inventory).map(([fruit, qty]) => (
        <List.Item key={fruit}>
          <Text>
            {fruit.charAt(0).toUpperCase() + fruit.slice(1)}: {qty}
          </Text>
        </List.Item>
      )),
    [inventory]
  );

  const handleFruitChange = (value: Fruit) => setSelectedFruit(value);
  const handleAmountChange = (value: number | null) => setAmount(value || 1);

  const handleBuy = useCallback(() => {
    const success = machine.buy(selectedFruit, amount);
    setInventory({ ...machine.getInventory() });
    if (success) {
      setMessage(`Bought ${amount} ${selectedFruit}(s)!`);
      antdMessage.success(`Bought ${amount} ${selectedFruit}(s)!`);
    } else {
      setMessage('Not enough fruit to buy.');
      antdMessage.error('Not enough fruit to buy.');
    }
  }, [selectedFruit, amount]);

  const handleSell = useCallback(() => {
    // Only allow selling if user has enough fruit
    if (inventory[selectedFruit] >= amount) {
      machine.sell(selectedFruit, amount);
      setInventory({ ...machine.getInventory() });
      setMessage(`Sold ${amount} ${selectedFruit}(s)!`);
      antdMessage.info(`Sold ${amount} ${selectedFruit}(s)!`);
    } else {
      setMessage('Not enough fruit to sell.');
      antdMessage.error('Not enough fruit to sell.');
    }
  }, [selectedFruit, amount, inventory]);

  // Improved message color logic
  let messageColor = COLORS.fruitViewText;
  if (message.startsWith('Bought')) {
    messageColor = COLORS.fruitViewBought;
  } else if (message.startsWith('Sold')) {
    messageColor = COLORS.fruitViewTextStrong;
  } else if (message.startsWith('Not enough')) {
    messageColor = COLORS.fruitViewNotEnough;
  }

  return (
    <ViewPanelWrapper className='panels'>
      <StyledCard>
        <Title level={3} style={{ marginTop: 0, marginBottom: 24 }}>
          Fruit View
        </Title>
        <Form
          layout='inline'
          style={{ marginBottom: 16, flexWrap: 'wrap', gap: 12 }}
          onSubmitCapture={(e) => e.preventDefault()}
        >
          <Form.Item label='Fruit'>
            <Select
              value={selectedFruit}
              onChange={handleFruitChange}
              style={{ width: 120 }}
              getPopupContainer={() => document.body}
              popupMatchSelectWidth={false}
              classNames={{ popup: { root: 'fruit-select-dropdown' } }}
            >
              {fruitOptions}
            </Select>
          </Form.Item>
          <Form.Item label='Amount'>
            <InputNumber
              min={1}
              value={amount}
              onChange={handleAmountChange}
              style={{ width: 80 }}
            />
          </Form.Item>
          <Form.Item>
            <Button type='primary' onClick={handleBuy}>
              Buy
            </Button>
            <Button type='default' onClick={handleSell}>
              Sell
            </Button>
          </Form.Item>
        </Form>
        <MessageWrapper>
          {message && (
            <Text strong style={{ color: messageColor }}>
              {message}
            </Text>
          )}
        </MessageWrapper>
        <Title level={4} style={{ marginBottom: 8 }}>
          Inventory
        </Title>
        <List size='small'>{inventoryList}</List>
      </StyledCard>
    </ViewPanelWrapper>
  );
};
