# Cookie consent for static websites

This is an experiment to see if I can improve the largest contentful paint(LCP) for static webpages with a cookie consent.

## Problem

Static websites can only render a cookie consent with JS, which is late and results in a late largest contentful paint, which impacts your performance. 

## Solution

Render HTML pages with the cookie consent and use a serviceworker to remove the cookie consent for subsequent pages when the cookie consent is accepted.
