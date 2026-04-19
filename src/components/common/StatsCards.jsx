import React from "react";
import { Row, Col, Card, Statistic } from "antd";

const StatsCards = ({ items }) => {
  const span = 24 / items.length;

  return (
    <Row gutter={16} style={{ marginBottom: 20 }}>
      {items.map((item, index) => (
        <Col span={span} key={index}>
          <Card>
            <Statistic
              title={item.title}
              value={item.value}
              suffix={item.suffix}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsCards;
