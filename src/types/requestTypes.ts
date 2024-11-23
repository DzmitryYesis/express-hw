import {Request} from 'express';

export type CustomRequest = Request<{}, {}, {}, {}>
export type RequestWithParam<P> = Request<P>;
export type RequestWithBody<B> = Request<{}, {}, B>;
export type RequestWithParamAndBody<P, B> = Request<P, {}, B>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type RequestWithParamAndQuery<P, Q> = Request<P, {}, {}, Q>;