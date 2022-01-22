import * as React from 'react';

export default function D3Logo() {
    return (
        <img
            className="d3-logo absolute opacity-40 bottom-2 right-2"
            draggable="false"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width={96} height={91}>
                <clipPath>
                    <path d="M0 0h7.75a45.5 45.5 0 1 1 0 91H0V71h7.75a25.5 25.5 0 1 0 0-51H0zm36.251 0h32a27.75 27.75 0 0 1 21.331 45.5A27.75 27.75 0 0 1 68.251 91h-32a53.69 53.69 0 0 0 18.746-20H68.25a7.75 7.75 0 1 0 0-15.5H60.5a53.69 53.69 0 0 0 0-20h7.75a7.75 7.75 0 1 0 0-15.5H54.997A53.69 53.69 0 0 0 36.251 0z" />
                </clipPath>
                <linearGradient
                    id="d3_js_svg__b"
                    gradientUnits="userSpaceOnUse"
                    x1={7}
                    y1={64}
                    x2={50}
                    y2={107}
                >
                    <stop offset={0} stopColor="#f9a03c" />
                    <stop offset={1} stopColor="#f7974e" />
                </linearGradient>
                <linearGradient
                    gradientUnits="userSpaceOnUse"
                    x1={2}
                    y1={-2}
                    x2={87}
                    y2={84}
                >
                    <stop offset={0} stopColor="#f26d58" />
                    <stop offset={1} stopColor="#f9a03c" />
                </linearGradient>
                <linearGradient
                    gradientUnits="userSpaceOnUse"
                    x1={45}
                    y1={-10}
                    x2={108}
                    y2={53}
                >
                    <stop offset={0} stopColor="#b84e51" />
                    <stop offset={1} stopColor="#f68e48" />
                </linearGradient>
                <g clipPath="url(#d3_js_svg__a)">
                    <path d="M-127-102v300h300z" fill="url(#d3_js_svg__b)" />
                    <path d="M-73-102h300v300z" fill="url(#d3_js_svg__c)" />
                    <path
                        d="m-100-102 300 300"
                        fill="none"
                        stroke="url(#d3_js_svg__d)"
                        strokeWidth={40}
                    />
                </g>
            </svg>
        </img>
    );
}
