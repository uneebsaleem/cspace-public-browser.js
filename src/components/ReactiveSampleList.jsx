import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ReactiveComponent } from '@appbaseio/reactivesearch';
import withReactiveBase from '../enhancers/withReactiveBase';
import SampleListContainer from '../containers/SampleListContainer';

const propTypes = {
  institutionId: PropTypes.string.isRequired,
  materialRefName: PropTypes.string.isRequired,
  onSamplesLoaded: PropTypes.func,
};

const defaultProps = {
  onSamplesLoaded: undefined,
};

class ReactiveSampleList extends Component {
  constructor() {
    super();

    this.handleData = this.handleData.bind(this);
  }

  handleData(hits) {
    const {
      institutionId,
      onSamplesLoaded,
    } = this.props;

    if (hits && onSamplesLoaded) {
      onSamplesLoaded(institutionId, hits.length);
    }
  };

  render() {
    const {
      onSamplesLoaded,
      ...remainingProps
    } = this.props;

    const {
      institutionId,
      materialRefName,
    } = remainingProps;

    return (
      <ReactiveComponent
        componentId={institutionId}
        defaultQuery={() => ({
          query: {
            bool: {
              must: [
                {
                  term: {
                    'ecm:primaryType': 'CollectionObject',
                  },
                },
                {
                  term: {
                    'collectionobjects_common:materialGroupList.material': materialRefName,
                  },
                },
              ],
            },
          },
          size: 500,
          from: 0,
          sort: [
            {
              'collectionobjects_common:objectNumber': {
                order: 'asc',
              },
            },
          ],
        })}
        onAllData={this.handleData}
      >
        <SampleListContainer {...remainingProps} />
      </ReactiveComponent>
    );
  }
}

ReactiveSampleList.propTypes = propTypes;
ReactiveSampleList.defaultProps = defaultProps;

export default withReactiveBase(ReactiveSampleList);