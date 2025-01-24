import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const excludedUrls = ['auth/login'];
  const isExcluded = excludedUrls.some(url => req.url.includes(url));
  if (isExcluded) {
    return next(req);
  }
  const authToken = localStorage.getItem('BIS_TOKEN');
  if (authToken) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return next(clonedRequest);
  }
  return next(req);
};
