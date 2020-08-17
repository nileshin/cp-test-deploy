import React, { Component } from 'react';
import { ReactComponent as LoadMore } from '../modules/_global/images/load-more.svg';
import 'snapsvg';

class Blob extends Component {
    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        const Snap = window.Snap;
        const mina = window.mina;
        if (Snap) {
            this.animateBlobPhases(Snap, mina);
        }
    }
    
    animateBlobPhases(Snap, mina) {
        let blob = Snap.select('#' + this.props.blobToBeDisplayed);
        if (blob.type === "svg") blob = Snap.select('#' + this.props.blobToBeDisplayed + ' > path');
        const blobPath = blob.node.getAttribute('d');
        const blobPhaseOne = () => {
          blob.animate({ d: blobPath }, 2000, mina.easeinout, blobPhaseTwo);
        }
        const blobPhaseTwo = () => {
          blob.animate({ 
            d: this.props.phaseTwoPath
          }, 2000, mina.easeinout, blobPhaseThree);
        }
        const blobPhaseThree = () => {
          blob.animate({ 
            d: this.props.phaseThreePath
          }, 2000, mina.easeinout, blobPhaseOne);
        }
  
        blobPhaseOne();
    }

    render() {
        const SelectedBlob = {
            loadMoreBlob: () => { 
                return <LoadMore id="loadMoreBlob" className="load-more-icon" />
            },
            bgBlob: () => {
                return (
                    <svg width="489px" height="591px" viewBox="0 0 489 591" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <g id="FinalPages" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g id="D.People" transform="translate(0.000000, -2153.000000)" fill="#393E46" fillRule="nonzero">
                                <g id="Leadership" transform="translate(-140.000000, 1157.000000)">
                                    <path id="bgBlob" d="M245.86719,1549.17838 C364.930362,1437.76606 628.938825,1452.1717 628.938825,1290.52576 C628.938825,1128.87982 542.205607,977.512689 370.535473,997.839895 C198.86534,1018.1671 63.6387013,1143.79503 10.1307994,1324.559 C-43.3771025,1505.32297 126.804018,1660.5907 245.86719,1549.17838 Z"></path>
                                </g>
                            </g>
                        </g>
                    </svg>
                );
            }
        }[this.props.blobToBeDisplayed]

        return (
            <SelectedBlob />
        );
    }
}

export default Blob;