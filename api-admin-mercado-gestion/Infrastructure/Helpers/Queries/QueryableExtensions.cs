using Application.Common;
using System.Linq.Expressions;
using System.Reflection;

namespace Infrastructure.Helpers.Queries
{
    public static class QueryableExtensions
    {
        public static IQueryable<T> ApplyFilter<T>(this IQueryable<T> query, BaseFilter filter)
        {
            if (!string.IsNullOrEmpty(filter.SortByColumn))
            {
                string methodName = filter.SortDirection == SortDirection.DESC ? "OrderByDescending" : "OrderBy";
                var type = typeof(T);
                var property = FindProperty(type, filter.SortByColumn, out List<PropertyInfo> parentProperty);

                if (property != null)
                {
                    var parameter = System.Linq.Expressions.Expression.Parameter(type, "p");
                    var propertyAccess = parentProperty == null ? System.Linq.Expressions.Expression.MakeMemberAccess(parameter, property) : CreatePropertyAccess(parameter, parentProperty, property);
                    var orderByExpression = System.Linq.Expressions.Expression.Lambda(propertyAccess, parameter);

                    var resultExpression = System.Linq.Expressions.Expression.Call(typeof(Queryable), methodName,
                        new Type[] { type, property.PropertyType },
                        query.Expression, System.Linq.Expressions.Expression.Quote(orderByExpression));

                    query = query.Provider.CreateQuery<T>(resultExpression);
                }
            }

            return query;
        }

        public static IQueryable<T> ApplyPagination<T>(this IQueryable<T> query, BaseFilter filter)
        {
            if (filter.Skip.HasValue)
            {
                query = query.Skip(filter.Skip.Value);
            }

            if (filter.Limit.HasValue)
            {
                query = query.Take(filter.Limit.Value);
            }
            return query;
        }

        private static PropertyInfo FindProperty(Type type, string propertyName, out List<PropertyInfo> parentProperty, int flag = 1)
        {
            var properties = type.GetProperties();

            if (flag >= 3)
            {
                parentProperty = null;
                return null;
            }
            foreach (var prop in properties)
            {
                if (prop.Name.Equals(propertyName, StringComparison.OrdinalIgnoreCase))
                {
                    parentProperty = null;
                    return prop;
                }

                if (prop.PropertyType.IsClass && prop.PropertyType != typeof(string))
                {
                    var innerProperty = FindProperty(prop.PropertyType, propertyName, out parentProperty, flag + 1);
                    if (innerProperty != null)
                    {
                        if (parentProperty == null)
                        {
                            parentProperty = new List<PropertyInfo>() { prop };
                        }
                        else
                        {
                            parentProperty.Add(prop);
                        }
                        return innerProperty;
                    }
                }
            }
            parentProperty = null;
            return null;
        }

        private static Expression CreatePropertyAccess(Expression parameter, List<PropertyInfo> parentProperty, PropertyInfo property)
        {
            Expression parentPropertyAccess = parameter;
            parentProperty.Reverse();
            foreach (var item in parentProperty)
            {

                parentPropertyAccess = Expression.MakeMemberAccess(parentPropertyAccess, item);

            }
            //var parentPropertyAccess = Expression.MakeMemberAccess(parameter, parentProperty);
            var propertyAccess = Expression.MakeMemberAccess(parentPropertyAccess, property);

            return propertyAccess;
        }
    }
}
