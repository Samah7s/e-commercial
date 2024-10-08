const config = {
	dev: process.env.NODE_ENV === 'development',
	test: process.env.NODE_ENV === 'test',
  port: process.env.PORT || 3000,
  session_secret: process.env.SESSION_SECRET,
};

export default config;
