import React, {Component} from 'react';
import { FormattedMessage } from 'react-intl';
import * as d3 from "d3";

import withLayout from '../layout';
import Link from '../components/Link';
import Image from '../components/Image';

class IndexPage extends Component {

  render() {
    const users = this.props.data.allRandomUser.edges;

    return (
      <>

        <h1>
          <FormattedMessage id="home.Hi people" />
        </h1>
        <p>
          <FormattedMessage id="home.Welcome to your new Gatsby site" />
        </p>
        <p>
          <FormattedMessage id="home.Now go build something great" />
        </p>
        <p>
          <a
            href="https://github.com/tomekskuta/gatsby-starter-intl"
            target="_blank"
            rel="noreferrer noopener"
          >
            <FormattedMessage id="home.or learn more" />
          </a>
        </p>
        <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
          <Image />
        </div>
        <Link to="/page-2/">
          <FormattedMessage id="home.Go to page 2" />
        </Link>

        {users.map((user, i) => {
          const userData = user.node;
          return (
            <div key={i}>
              <p>Name: {userData.name.first}</p>
            </div>
          )
        })}
      </>
    );
  }

  componentDidMount() {
    this.drawChart();
  }

  drawChart = ()=> {
  
    const data = [12, 5, 6, 6, 9, 10];
      
    const svg = d3.select("body").append("svg").attr("width", 700).attr("height", 300);
  
    svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 70)
    .attr("y", 0)
    .attr("width", 25)
    .attr("height", (d, i) => d)
    .attr("fill", "green");
    
  }
}


const customProps = {
  localeKey: 'home', // same as file name in src/i18n/translations/your-lang/index.js
};

export default withLayout(customProps)(IndexPage);

export const query = graphql`
  query RandomUserQuery {
    allRandomUser {
      edges {
        node {
          gender
          name {
            title
            first
            last
          }
          picture {
            large
            medium
            thumbnail
          }
        }
      }
    }
  }
`;
